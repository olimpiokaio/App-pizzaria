import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaPizzaPage } from './nova-pizza.page';

describe('NovaPizzaPage', () => {
  let component: NovaPizzaPage;
  let fixture: ComponentFixture<NovaPizzaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovaPizzaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovaPizzaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
