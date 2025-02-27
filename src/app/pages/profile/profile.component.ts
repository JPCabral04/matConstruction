import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { IUser } from '../../shared/interfaces/user.interface';
import { DatabaseService } from '../../shared/services/database.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  formWasEditted: boolean = false;

  selectedPhotoFile: File | null = null;
  previewUrl: string | null = null;
  isUploading: boolean = false;

  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    userType: new FormControl({ value: '', disabled: true }, [Validators.required]),
    userCode: new FormControl({ value: '', disabled: true }, [Validators.required]),
    photoPath: new FormControl('')
  });

  constructor(private auth: AuthService, private db: DatabaseService, private storage: AngularFireStorage,) { }

  ngOnInit(): void {
    this.auth.getUserData().subscribe((user: IUser) => {
      if (user) {
        this.profileForm.patchValue({
          name: user.nome,
          email: user.email,
          userType: user.tipoUsuario,
          userCode: user.codigo,
        });


        this.previewUrl = user.imagemUrl || "assets/images/perfil.png";
      }

      this.formWasEditted = false;
    });

    // Monitorar mudanças no formulário
    this.profileForm.valueChanges.subscribe(() => {
      this.formWasEditted = true;
    });
  }


  onFileSelected(event: any) {
    this.selectedPhotoFile = event.target.files[0];
    if (this.selectedPhotoFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedPhotoFile);
    }
  }

  storeImage() {
    return new Promise<string>((resolve, reject) => {
      if (!this.selectedPhotoFile) {
        reject('Nenhuma imagem selecionada.');
        return;
      }

      this.isUploading = true; // Inicia o loading

      const filePath = `images/${Date.now()}_${this.selectedPhotoFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.selectedPhotoFile);

      uploadTask.then(() => {
        fileRef.getDownloadURL().subscribe(
          (downloadURL: string) => {
            this.isUploading = false; // Termina o loading
            resolve(downloadURL);
          },
          (error: Error) => {
            this.isUploading = false;
            reject(error);
          }
        );
      }).catch((error: Error) => {
        this.isUploading = false;
        reject(error);
      });
    });
  }


  saveFormChanges() {
    this.auth.getUserId().subscribe(id => {
      if (id) {

        if (this.profileForm.valid) {
          const userData = {
            nome: this.profileForm.value.name || undefined,
            email: this.profileForm.value.email || undefined,
            imagemUrl: this.selectedPhotoFile ? this.storeImage() : undefined // Chama storeImage se uma foto foi selecionada
          };

          console.log(userData.imagemUrl);

          // Verifica se imagem foi carregada antes de atualizar
          userData.imagemUrl?.then((imageUrl: string) => {
            this.db.updateDocument<IUser>('users', id, { ...userData, imagemUrl: imageUrl })
              .then(() => {
                this.formWasEditted = false;
                alert('Perfil atualizado');
              })
              .catch((error) => {
                console.error('Erro ao atualizar perfil:', error);
              });
          }).catch(error => {
            console.error('Erro ao fazer upload da imagem:', error);
          });
        }
      }
    });
  }


}
