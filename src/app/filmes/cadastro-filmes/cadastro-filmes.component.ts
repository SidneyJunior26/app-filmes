import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmesService } from 'src/app/core/filmes.service';
import { AlertaComponent } from 'src/app/shared/components/alert/alerta.component';
import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { Alerta } from 'src/app/shared/models/alerta';
import { Filme } from 'src/app/shared/models/filme';

@Component({
  selector: 'app-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {

  id: number;
  cadastro: FormGroup;
  generos: Array<String>;

  constructor(public validacao: ValidarCamposService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private service: FilmesService,
    private router: Router,
    private activatedRouter: ActivatedRoute) { }

  get f() {
    return this.cadastro.controls;
  }

  ngOnInit() {

    this.id = this.activatedRouter.snapshot.params['id'];

    if (this.id) {
      this.service.visualizar(this.id).subscribe((filme) => this.criarFormulario(filme));
    }
    else {
      this.criarFormulario(this.criarFilmeBranco());
    }

    this.generos = [
      'Ação',
      'Comédia',
      'Romance',
      'Drama',
      'Aventura',
      'Terror',
      'Ficção Cientifica'
    ]
  }

  submit(): void {
    this.cadastro.markAllAsTouched();

    if (this.cadastro.invalid) {
      return;
    }

    const filme = this.cadastro.getRawValue() as Filme;
    if (this.id) {
      filme.id = this.id;
      this.editar(filme);
    }
    else {
      this.salvar(filme);
    }
  }

  limparForm(): void {
    if (this.id) {
      this.router.navigateByUrl('filmes');
    }
    else {
      this.cadastro.reset();
    }
  }

  private criarFormulario(filme: Filme): void {
    this.cadastro = this.fb.group({
      titulo: [filme.titulo, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]],
      urlFoto: [filme.urlFoto, [Validators.minLength(10)]],
      dtLancamento: [filme.dtLancamento, [Validators.required]],
      descricao: [filme.descricao],
      nota: [filme.nota, [Validators.required, Validators.min(0), Validators.max(10)]],
      urlIMDb: [filme.urlIMDb, [Validators.minLength(10)]],
      genero: [filme.genero, [Validators.required]]
    });
  }

  private criarFilmeBranco(): Filme {
    return {
      id: null,
      titulo: null,
      urlFoto: null,
      dtLancamento: null,
      descricao: null,
      nota: null,
      urlIMDb: null,
      genero: null
    } as Filme
  }

  private salvar(filme: Filme): void {
    this.service.salvar(filme).subscribe(() => {
      const config = {
        data: {
          btnSucesso: 'Ir para a tela de listagem',
          btnCancelar: 'Cadastrar um novo filme',
          corBtnCancelar: 'primary',
          possuiBtnFechar: true
        } as Alerta
      };

      const dialogRef = this.dialog.open(AlertaComponent, config);
      dialogRef.afterClosed().subscribe((opcao: boolean) => {
        if (opcao) {
          this.router.navigateByUrl('filmes');
        }
        else {
          this.limparForm();
        }
      });
    },
      err => {
        const config = {
          data: {
            titulo: 'Erro ao salvar',
            descricao: 'Não conseguimos salvar seu registro. Tente novamente mais tarde.',
            corBtnSucesso: 'warn',
            btnSucesso: 'Fechar',
            possuiBtnFechar: false
          } as Alerta
        };

        this.dialog.open(AlertaComponent, config);
      });
  }

  private editar(filme: Filme): void {
    this.service.editar(filme).subscribe(() => {
      const config = {
        data: {
          descricao: 'Seu registro foi atualizado!',
          btnSucesso: 'Ir para a tela de listagem'
        } as Alerta
      };

      const dialogRef = this.dialog.open(AlertaComponent, config);
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigateByUrl('filmes');
      });
    },
      err => {
        const config = {
          data: {
            titulo: 'Erro ao editar',
            descricao: 'Não conseguimos editar seu registro. Tente novamente mais tarde.',
            corBtnSucesso: 'warn',
            btnSucesso: 'Fechar',
            possuiBtnFechar: false
          } as Alerta
        };

        this.dialog.open(AlertaComponent, config);
      });
  }

}
