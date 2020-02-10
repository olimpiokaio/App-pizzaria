import { Cargo } from './../../../categoria/categoria.model';
import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';

import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FuncionarioService } from './../../funcionario.service';
import { Funcionario } from '../../funcionario.model';
import { CategoriaService } from './../../../categoria/categoria.service';

import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

@Component({
  selector: 'app-editar-funcionario',
  templateUrl: './editar-funcionario.page.html',
  styleUrls: ['./editar-funcionario.page.scss'],
})
export class EditarFuncionarioPage implements OnInit {

  form: FormGroup;
  funcionario: Funcionario;
  funcionarioId: string;
  isLoading = false;
  private funcionarioSub: Subscription;
  imageUrl: any;

  cargos: Cargo[];
  private cargoSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private funcionarioService: FuncionarioService,
    private navCtrl: NavController,
    private router: Router,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private categoriaService: CategoriaService,
    private sanitizer: DomSanitizer // camera capacitor
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('funcionarioId')) {
        this.navCtrl.navigateBack('/pizzaria/tabs/funcionario/');
        return;
      }
      this.funcionarioId = paramMap.get('funcionarioId');
      this.isLoading = true;
      this.funcionarioSub = this.funcionarioService
        .getFuncionario(paramMap.get('funcionarioId'))
        .subscribe(funcionario => {
          this.funcionario = funcionario;
          this.form = new FormGroup({
            nome: new FormControl(this.funcionario.nome,{
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            cargo: new FormControl(this.funcionario.cargo,{
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            dataNascimento: new FormControl(this.funcionario.dataNascimento,{
              updateOn: 'blur',
              validators: [Validators.required]
            })
          });
          this.imageUrl = funcionario.imageUrl;
        this.isLoading = false;
      }, error => {
        console.log(error);
        this.alertCtrl.create({
          header: 'Ocorreu um erro!', 
          message: 'O funcionario não foi encontrado, por favor tente mais tarde.',
          buttons: [{text: 'ok', handler: () => {
            this.router.navigate(['/pizzaria/tabs/funcionario/']);
          }}]
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });

    this.cargoSub = this.categoriaService.cargos.subscribe(cargos => {
      this.cargos = cargos;
    });

    defineCustomElements(window);
  }

  ionViewWillEnter() {
    this.categoriaService.fetchCargos().subscribe();
  }

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });
    this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl))
    this.imageUrl = image.dataUrl;
  }

  atualizarFuncionario() {
    if(!this.form.valid) {
      return
    }
    this.loadingController.create({
      message: 'Atualizando Funcionario...'
    }).then(loadingEl => {
      loadingEl.present();
      this.funcionarioService.atualizaFuncionario(
        this.funcionario.id, 
        this.form.value.nome, 
        this.form.value.cargo,
        this.form.value.dataNascimento,
        this.imageUrl
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/pizzaria/tabs/funcionario']);
      });
    })
  }


}
