import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  Self,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  NgModel,
} from '@angular/forms';

const MAC_ENTER = 3;
const BACKSPACE = 8;
const TAB = 9;
const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;
const DELETE = 46;
const ZERO = 48;
const NINE = 57;
const NUMPAD_ZERO = 96;
const NUMPAD_NINE = 105;
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[ngModel][ngxTimeMask]',
  providers: [NgModel],
})
export class NgxTimeMaskDirective {
  // tslint:disable-next-line: no-output-native
  @Output() change = new EventEmitter();

  private fieldJustGotFocus = false;

  constructor(@Self() private element: ElementRef, private renderer: Renderer2, private ngModel: NgModel) { }

  /** Listener on Keydown */
  @HostListener('keydown', ['$event'])
  onKeyDown(evt: KeyboardEvent) {
    const keyCode = evt.keyCode;
    switch (keyCode) {
      case LEFT_ARROW:
      case RIGHT_ARROW:
      case TAB:
        this._checkAndJumpCursor(keyCode, evt);
        break;

      case DELETE:
      case BACKSPACE:
        evt.preventDefault();
        break;

      case DOWN_ARROW:
        this._setInputText(null, -1);
        break;
      case UP_ARROW:
        this._setInputText(null, 1);
        break;


      default:
        if ((keyCode >= ZERO && keyCode <= NINE) ||
          (keyCode >= NUMPAD_ZERO && keyCode <= NUMPAD_NINE)) {
          this._setInputText(evt.key, 0);
        }
    }

    if (keyCode !== TAB) {
      evt.preventDefault();
    }
  }

  /** Listener on click */
  @HostListener('click', ['$event'])
  onClick() {
    this.fieldJustGotFocus = true;
    const caretPosition = this._getCursorPosition();
    if (caretPosition < 3) {
      this.element.nativeElement.setSelectionRange(0, 2);
    } else {
      this.element.nativeElement.setSelectionRange(3, 6);
    }
  }

  /** Listener on focus */
  @HostListener('focus', ['$event'])
  onFocus() {
    this.fieldJustGotFocus = true;
    const caretPosition = this._getCursorPosition();
    if (caretPosition < 3) {
      this.element.nativeElement.setSelectionRange(0, 2);
    } else {
      this.element.nativeElement.setSelectionRange(3, 6);
    }
  }

  /** Listener on blur */
  @HostListener('blur', ['$event'])
  onBlur() {
    this._validateField();
  }

  private _validateField() {
    const selectedTime = this.element.nativeElement.value.split(':');
    if (selectedTime[0] === '00') {
      const completeTime = `01:${selectedTime[1]}`;

      this.renderer.setProperty(this.element.nativeElement, 'value', completeTime);
      this.inputDataChanged();
    }
  }

  private _checkAndJumpCursor(keyCode: number, evt?: KeyboardEvent) {

    const caretPosition = this._getCursorPosition();

    switch (keyCode) {
      case RIGHT_ARROW:
        this.element.nativeElement.setSelectionRange(3, 6);
        break;

      case LEFT_ARROW:
        this.element.nativeElement.setSelectionRange(0, 2);
        break;

      case TAB:
        if (caretPosition < 2 && !evt.shiftKey) {
          this.element.nativeElement.setSelectionRange(3, 6);
          evt.preventDefault();
        } else if (caretPosition > 2 && evt.shiftKey) {
          this.element.nativeElement.setSelectionRange(0, 2);
          evt.preventDefault();
        }
    }

    this.fieldJustGotFocus = true;
    this._validateField();
  }

  private _setInputText(key: string, valueToAppend: number) {
    const input: string[] = this.element.nativeElement.value.split(':');

    let hours: string = input[0];
    let minutes: string = input[1];
    const caretPosition = this._getCursorPosition();
    if (caretPosition < 3) {
      hours = this.getHoursInStringAfterAppend(+hours, valueToAppend, 12);
      this._setHours(hours, minutes, key);
    } else {
      minutes = this.getHoursInStringAfterAppend(+minutes, valueToAppend, 60);
      this._setMinutes(hours, minutes, key);
    }
  }

  getHoursInStringAfterAppend(hours: number, valueToAppend: number, limitToReset: number): string {
    // Hours should be b/w  01 - 12 and Minutes should be 0-59
    if (limitToReset === 12) {
      if (hours <= limitToReset) {
        let valueAfterAppend = hours + valueToAppend;
        if (valueAfterAppend < 0) {
           valueAfterAppend = 12;
        } else if (valueAfterAppend > limitToReset) {
          valueAfterAppend = 1;
        }
        return valueAfterAppend < 10 ? `0${valueAfterAppend}` : `${valueAfterAppend}`;
      }
    } else {
      if (hours <= limitToReset) {
        let valueAfterAppend = hours + valueToAppend;
        if (valueAfterAppend < 0) {
          valueAfterAppend =  59;
        } else if (valueAfterAppend > limitToReset) {
          valueAfterAppend = 0;
        }
        return valueAfterAppend < 10 ? `0${valueAfterAppend}` : `${valueAfterAppend}`;
      }

    }

    return '01';

  }

  private _setHours(hours: string, minutes: string, key) {
    const hoursArray: string[] = hours.split('');
    const firstDigit: string = hoursArray[0];
    const secondDigit: string = hoursArray[1];

    let newHour = '';

    let completeTime = '';
    let sendCursorToMinutes = false;
    if (key !== null) {
      if (firstDigit === '-' || this.fieldJustGotFocus) {
        newHour = `0${key}`;
        sendCursorToMinutes = Number(key) > 1;
        this.fieldJustGotFocus = false;
      } else {
        newHour = `${secondDigit}${+key === 0 && +secondDigit === 0 ? '1' : key}`;
        if (Number(newHour) > 12) {
          newHour = '12';
        }
        if (Number(newHour) === 0) {
          newHour = '01';

        }
        sendCursorToMinutes = true;
      }
    } else {
      newHour = `${hours}`;
      if (Number(newHour) > 12) {
        newHour = '12';
      }
      if (Number(newHour) === 0) {
        newHour = '12';

      }
    }

    completeTime = `${newHour}:${minutes}`;

    this.renderer.setProperty(this.element.nativeElement, 'value', completeTime);
    this.inputDataChanged();
    if (sendCursorToMinutes) {
      this.element.nativeElement.setSelectionRange(3, 6);
      this.fieldJustGotFocus = true;
    } else {
      this.element.nativeElement.setSelectionRange(0, 2);
      this.fieldJustGotFocus = false;
    }
  }


  private _setMinutes(hours: string, minutes: string, key) {
    const minutesArray: string[] = minutes.split('');
    const firstDigit: string = minutesArray[0];
    const secondDigit: string = minutesArray[1];
    let resetCursor = false;

    let newMinutes = '';

    let completeTime = '';

    if (key !== null) {
      if (firstDigit === '-' || this.fieldJustGotFocus) {
        newMinutes = `0${key}`;
      } else {
        if (Number(minutes) === 59) {
          newMinutes = `0${key}`;
        } else {
          newMinutes = `${secondDigit}${key}`;
          if (Number(newMinutes) > 59) {
            newMinutes = '59';
          }
          resetCursor = true;
        }
      }
    } else {
      newMinutes = `${minutes}`;
      if (Number(newMinutes) > 59) {
        newMinutes = '00';
      }
    }

    completeTime = `${hours}:${newMinutes}`;

    this.renderer.setProperty(this.element.nativeElement, 'value', completeTime);
    this.inputDataChanged();
    if (resetCursor) {
      this.element.nativeElement.setSelectionRange(0, 2);
      this.fieldJustGotFocus = true;
    } else {
      this.element.nativeElement.setSelectionRange(3, 6);
      this.fieldJustGotFocus = false;
    }
  }


  /*
  ** Returns the cursor position of the specified text field.
  ** Return value range is 0 - imput value length.
  */
  private _getCursorPosition(): number {

    // Initialize
    let cursorPos = 0;

    const nativeElement = this.element.nativeElement;

    // IE Support
    if (document.hasOwnProperty('selection')) {
      // Set focus on the element
      nativeElement.focus();

      // To get cursor position, get empty selection range
      // tslint:disable-next-line: no-string-literal
      const oSel = document['selection'].createRange();

      // Move selection start to 0 position
      oSel.moveStart('character', -nativeElement.value.length);

      // The caret position is selection length
      cursorPos = oSel.text.length;
    } else if (nativeElement.selectionStart || nativeElement.selectionStart === '0') {
      // Firefox support
      cursorPos = nativeElement.selectionStart;
    }

    // Return results
    return cursorPos;
  }

  /** Emit Data on Change  */
  private inputDataChanged() {
    this.ngModel.update.emit(this.element.nativeElement.value);
    this.change.emit(this.element.nativeElement.value);
  }

}
