import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPizzaPage } from './editar-pizza.page';

describe('EditarPizzaPage', () => {
  let component: EditarPizzaPage;
  let fixture: ComponentFixture<EditarPizzaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarPizzaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarPizzaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
