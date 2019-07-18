import {ElementRef} from "@angular/core";

declare var M;

export interface MaterialInstance {
  open?(): null;

  close?(): null;

  destroy?(): null;

}

export interface MaterialDatepicker extends MaterialInstance {
  date?: Date;

}

export class MaterialService {
  static toast(message: string) {
    M.toast({html: message})
  }

  static initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement);
  }

  static updateTextInputs() {
    M.updateTextFields();
  }

  static initModal(nativeElement: any): MaterialInstance {
    return M.Modal.init(nativeElement)
  }

  static initTooltip(ref: ElementRef): MaterialInstance {
    return M.Tooltip.init(ref.nativeElement);
  }

  static initDatePicker(ref: ElementRef, onClose: () => void): MaterialDatepicker {
    return M.Datepicker.init(ref.nativeElement,
      {
        format: 'dd.mm.yyyy',
        showClearBtn: true,
        onClose
      });
  }

  static initTapTarger(tapTargetRef: ElementRef): MaterialInstance {
    return M.TapTarget.init(tapTargetRef.nativeElement);
  }
}
