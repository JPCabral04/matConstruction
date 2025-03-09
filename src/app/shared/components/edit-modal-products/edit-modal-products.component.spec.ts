import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModalProductsComponent } from './edit-modal-products.component';

describe('EditModalProductsComponent', () => {
  let component: EditModalProductsComponent;
  let fixture: ComponentFixture<EditModalProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditModalProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditModalProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
