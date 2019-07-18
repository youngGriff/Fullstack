import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../shared/services/positions.service";
import {Position} from "../../../shared/interfaces";
import {finalize} from "rxjs/operators";
import {MaterialInstance, MaterialService} from "../../../shared/classes/material.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;
  positions;
  loading = true;
  modal: MaterialInstance;
  form: FormGroup;
  positionId = null;

  constructor(private positionService: PositionsService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      cost: new FormControl(1,
        [Validators.required, Validators.min(1)])

    });
    this.positionService.fetch(this.categoryId)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((positions: Position[]) => {
        this.positions = positions;
      })
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue(position);
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onAddPosition() {
    this.positionId = null;
    this.modal.open();
    this.form.reset({cost: 1});

    MaterialService.updateTextInputs();

  }

  onCancel() {
    this.modal.close();
    this.form.reset({cost: 1});

  }

  onDeletePosition($event: Event, position: any) {
    $event.stopPropagation();
    const decition = window.confirm(`Удалить "${position.name}"?`);
    if (decition) {
      this.positionService.delete(position)
        .subscribe((response: any) => {
            const i = this.positions.findIndex(p => p._id === position._id);
            this.positions.splice(i, 1);
            MaterialService.toast(response.message);
          },
          err => {
            MaterialService.toast(err.error.message);
          });
    }
  }

  onSubmit() {
    this.form.disable();
    const newPosition: Position = {...this.form.value, category: this.categoryId};
    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionService.update(newPosition)
        .subscribe((position) => {
            const i = this.positions.findIndex(p => p._id === this.positionId);
            MaterialService.toast('Изменения сохранены');
            this.positions[i] = position;
          },
          error => {
            MaterialService.toast(error.error.message);
          },

          this.completed
        );
    } else {
      this.positionService.create(newPosition)
        .subscribe((position) => {
            MaterialService.toast('Позиция создана');
            this.positions.push(position);
          },
          error => {
            MaterialService.toast(error.error.message);
          },
          this.completed)
    }
  }

  completed = () => {
    this.modal.close();
    this.form.reset({cost: 1});
    this.form.enable();
  };
}
