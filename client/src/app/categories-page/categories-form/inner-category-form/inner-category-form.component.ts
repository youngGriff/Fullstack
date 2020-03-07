import { Component, ElementRef,EventEmitter, Input, OnInit, Output, ViewChild, OnChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MaterialService} from "../../../shared/classes/material.service";
import {CategoriesService} from "../../../shared/services/categories.service";

@Component({
  selector: 'app-inner-category-form',
  templateUrl: './inner-category-form.component.html',
  styleUrls: ['./inner-category-form.component.css']
})
export class InnerCategoryFormComponent implements OnInit, OnChanges  {
  @ViewChild('input') inputRef: ElementRef;

  image: File;

  @Input() isNew = true;
  form: FormGroup;
  imagePreview: string | ArrayBuffer = '';
  @Input() category;
  @Output() onSend = new EventEmitter();
  constructor(  private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
    });
  }

  ngOnChanges(): void {

    if (this.category){
      this.form.patchValue(this.category);
      this.imagePreview = this.category.imageSrc;
    }
    else {
      this.form && this.form.reset();
      this.imagePreview = null;
    }

  }

  submit() {
    this.form.disable();
    let obs$;
    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image);
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)
    }
    obs$.subscribe((category) => {
        this.form.enable();
        this.onSend.emit(category);
        this.form.reset();
        MaterialService.toast('Изменения сохранены');
      },
      error => {
        this.form.enable();
        this.form.reset();

        MaterialService.toast(error.error.message);
      }
    );
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

  triggerClick() {
    this.inputRef.nativeElement.click();
  }
}
