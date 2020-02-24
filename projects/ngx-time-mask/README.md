
* [Installation](#installation)
* [Usage](#usage)
* [API](#api)
* [Contribute](#contribute)


## Installation

First you need to install the npm module:

```sh
npm install ngx-time-mask --save
```


## Usage

#### 1. Import the `ngx-time-mask`:

Once installed you need to import the main module into your application module by importing NgxTimeMaskModule. 

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxTimeMaskModule } from 'ngx-time-mask';

@NgModule({
  imports: [
    BrowserModule,
    NgxTimeMaskModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```


#### 2. Use the directive:

This is how you do it with the **directive**:
```html
<input class="time-count" ngxTimeMask [(ngModel)]="data" (change)="onTimeChange($event)">
```
And in your component define data (`12:00` by default).


## Contribute
`ngx-time-mask` is packaged with [ng-packagr](https://github.com/dherges/ng-packagr) and then imported into an Angular CLI app.
To check the demo, [click](https://stackblitz.com/edit/angular-time-directive):


***
MIT © [Avinash Maurya](https://github.com/aviking88)
