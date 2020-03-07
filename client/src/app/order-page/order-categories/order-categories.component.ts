import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CategoriesService} from "../../shared/services/categories.service";
import {Subscription} from "rxjs";
import {Category} from "../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-order-categories',
  templateUrl: './order-categories.component.html',
  styleUrls: ['./order-categories.component.css']
})
export class OrderCategoriesComponent implements OnInit, AfterViewInit, OnDestroy {
  modelCategory: MaterialInstance;
  isNew = true;
  category: Category;
  @ViewChild("categoryModal") modalCategoryRef: ElementRef;
  isLoading= true;
  categories;
  sub:Subscription;

  constructor(private categoriesService: CategoriesService) {
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

  onUpdate(category: Category) {
    this.modelCategory.open();
    this.category = category;
    this.isNew = false;
  }

  onDelete(category: any) {
    if (confirm("Удалить")) {
      this.categoriesService.deleteCategory(category)
        .subscribe(()=>{
          this.categories = this.categories.filter((e)=>e._id !== category._id)
        })
    }
  }

  ngOnDestroy(): void {
    this.modelCategory.destroy();

  }

  onCategorySaved(category) {
    if (this.isNew){
      this.categories.push(category);
    }
    else {
      this.categories = this.categories.map((cat)=>{
        if (cat._id == category._id){
          return category;
        }

        return  cat;

      });
    }
    this.modelCategory.close();
  }
}
