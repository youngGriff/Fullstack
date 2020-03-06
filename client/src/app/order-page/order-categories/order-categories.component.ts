import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CategoriesService} from "../../shared/services/categories.service";
import {Subscription} from "rxjs";
import {Category} from "../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../shared/classes/material.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-order-categories',
  templateUrl: './order-categories.component.html',
  styleUrls: ['./order-categories.component.css']
})
export class OrderCategoriesComponent implements OnInit, AfterViewInit, OnDestroy {
  modelCategory: MaterialInstance;
  image: File;
  imagePreview: string | ArrayBuffer = '';
  isNew = true;
  category: Category;
  @ViewChild("categoryModal") modalCategoryRef: ElementRef;
  @ViewChild('input') inputRef: ElementRef;
  form: FormGroup;
  isLoading= true;
  categories;
  sub:Subscription;

  constructor(private categoriesService: CategoriesService) {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),

    });
  }

  ngOnInit() {
   this.sub = this.categoriesService.fetch()
      .subscribe((newCategoreis:Category[])=>{
        this.categories = newCategoreis;
      },()=>{
        alert("Ошибка");
      }, ()=>{
        this.isLoading = false;
      });

  }
  onAddCategory() {
    this.modelCategory.open();
    this.category = null;
    this.isNew = true;
  }

  ngAfterViewInit(): void {
    this.modelCategory = MaterialService.initModal(this.modalCategoryRef.nativeElement);

  }

  onSubmit() {
    this.form.disable();
    let obs$;
    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image);
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)
    }
    obs$.subscribe((category) => {
        this.form.enable();
        MaterialService.toast('Изменения сохранены');
        if (this.isNew){
          this.categories.push(category);
        }else {
          this.categories = this.categories.map((cat)=>{
            if (cat._id == category._id){
                return category;
            }

              return  cat;

          });
        }
        this.modelCategory.close();
        this.form.reset();

      },
      error => {
        this.form.enable();
        MaterialService.toast(error.error.message);
        this.modelCategory.close();

      }
    );

  }

  onFileUpload($event) {
    const file = $event.target.files[0];
    this.image = file;
    this.updateImagePreview();
  }

  private updateImagePreview() {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.image);
  }

  triggerClick() {
    this.inputRef.nativeElement.click();

  }

  ngOnDestroy(): void {
    this.modelCategory.destroy();

  }

  onDelete(category: any) {
    if (confirm("Удалить")) {
      this.categoriesService.deleteCategory(category)
        .subscribe(()=>{
          this.categories = this.categories.filter((e)=>e._id !== category._id)
        })
    };
  }

  onUpdate(category: Category) {
    this.modelCategory.open();
    this.category = category;
    this.isNew = false;
    this.form.patchValue(this.category);
    this.imagePreview = category.imageSrc;
  }
}
