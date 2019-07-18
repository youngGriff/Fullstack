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

  @ViewChild('input') inputRef: ElementRef;

  image: File;
  isNew = true;
  form: FormGroup;
  imagePreview: string | ArrayBuffer = '';
  category: Category;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private categoriesService: CategoriesService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),

    });
    this.form.disable();
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
          this.form.patchValue({name: category.name});
          this.imagePreview = category.imageSrc;
          MaterialService.updateTextInputs();
        }
        this.form.enable();

      },
      error => {
        MaterialService.toast(error.error.message);
      })
  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }

  onFileUpload($event) {
    const file = $event.target.files[0];
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.image);
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
      },
      error => {
        this.form.enable();
        MaterialService.toast(error.error.message);
      }
    );
  }
}
