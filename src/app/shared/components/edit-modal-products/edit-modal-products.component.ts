import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IProduct } from '../../interfaces/product.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { IUser } from '../../interfaces/user.interface';

@Component({
  selector: 'app-edit-modal-products',
  templateUrl: './edit-modal-products.component.html',
  styleUrl: './edit-modal-products.component.scss'
})
export class EditModalProductsComponent implements OnInit {
  @Input() product?: IProduct;
  @Output() modalState = new EventEmitter<boolean>();

  selectedPhotoFile: File | null = null;
  previewUrl: string | null = null;
  isUploading: boolean = false;

  editingUserName?: string;

  editForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    type: new FormControl(''),
    brand: new FormControl(''),
    photoPath: new FormControl('')
  });

  constructor(private db: DatabaseService, private storage: AngularFireStorage) { }

  ngOnInit() {
    this.getEditingUserEmail();

    if (this.product) {
      this.editForm.patchValue({
        name: this.product.nome,
        description: this.product.descricao,
        type: this.product.tipo,
        brand: this.product.marca,
      });

      this.previewUrl = this.product.imagemUrl || "assets/images/perfil.png";
    }
  }

  getEditingUserEmail() {
    if (this.product?.idUsuarioEditou) {
      this.db.getDocument<IUser>('users', this.product?.idUsuarioEditou).subscribe(user => {
        if (user) {
          this.editingUserName = user.email;
        }
      })
    }
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

  storeImage(): Promise<string> {
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

  closeModal() {
    this.modalState.emit(false);
  }

  onSubmit() {
    if (this.product?.id) {
      const formData = {
        nome: this.editForm.get('name')?.value || undefined,
        descricao: this.editForm.get('description')?.value || undefined,
        tipo: this.editForm.get('type')?.value || undefined,
        marca: this.editForm.get('brand')?.value || undefined
      };

      const updatedProduct: Partial<IProduct> = {
        ...this.product,
        ...formData,
        dataUltimaEdicao: this.getCurrentDateISO()
      };

      if (this.selectedPhotoFile) {
        this.storeImage().then((imageUrl: string) => {
          updatedProduct.imagemUrl = imageUrl;
          this.updateProduct(updatedProduct);
        }).catch((error) => {
          console.log('Erro ao armazenar imagem', error);
        });
      } else {
        this.updateProduct(updatedProduct);
      }
    }
  }

  private updateProduct(updatedProduct: Partial<IProduct>) {
    if (this.product?.id) {
      this.db.updateDocument<IProduct>('products', this.product.id, updatedProduct)
        .then(() => {
          console.log('Produto atualizado');
          this.closeModal();
        })
        .catch((error) => {
          console.log('Erro ao atualizar produto', error);
        });
    } else {
      console.log('ID do produto não está definido');
    }
  }

  private getCurrentDateISO(): string {
    const today = new Date();
    return today.toISOString().split("T")[0] + "T00:00:00.000";
  }
}
