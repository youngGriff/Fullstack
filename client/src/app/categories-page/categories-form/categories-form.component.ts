import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {MaterialService} from "../../shared/classes/material.service";
import {Category, Message} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {
  isNew = true;
   category: Category;



  constructor(private route: ActivatedRoute,
              private router: Router,
              private categoriesService: CategoriesService) {
  }

  ngOnInit() {

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.isNew = !params['id'];
          if (!this.isNew) {
            return this.categoriesService.getById(params['id']);
          } else {
            return of(null);
          }
        })
      ).subscribe((category: Category) => {
        if (category) {
          this.category = category;
          MaterialService.updateTextInputs();
        }
        else{
          this.category = null;
        }
        this.isNew = !this.category;
      },
      error => {
        MaterialService.toast(error.error.message);
      })
  }





  deleteCategory() {
    const desition = window.confirm(`Уверены, что хотите удалить категориию ${this.category.name}`);
    if (desition) {
      this.categoriesService.deleteCategory(this.category)
        .subscribe((res: Message) => {
            MaterialService.toast(res.message)
          },
          error => {
            MaterialService.toast(error.error.message)
          },
          () => {
            this.router.navigate(['/categories']);
          }
        );
    }
  }


  onCategorySubmit() {
  }
}
