import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'prueba-tecnica';

  //public _adn :string[]= ['ATGCGA','CAGTGC','TTATGT','AGAAGG','CCCCTA','TCACTG'];
  public _adn :string[]= ["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"];
  public _adnInput :string='';
  public _matriz:string[][]=[];

 public _formulario:FormGroup = new FormGroup({
     txtDnaSeq : new FormControl('', Validators.required)
  });

  constructor(private fb : FormBuilder, private toastr: ToastrService){

  }

  ngOnInit(): void {
    
  }

 public validateContent(){
  let _isMutant : string[] = [];
  this._adnInput =this._formulario.controls['txtDnaSeq'].value;
  
//console.log('Inserte valor',this._adnInput);
  this._adn= this._adnInput.split(',');
//console.log('Inserte valor',this._adn);

  this.GenerarMatriz();

  _isMutant =this.IsMutant();

  if (_isMutant.length>0){
    this.toastr.warning(`La cadena ingresada [${_isMutant}] es mutante`,'Alerta Mutante!!');
    
    return;
  }
  
  this.invertirMatriz();
  _isMutant =this.IsMutant();

  if (_isMutant.length>0){
    this.toastr.warning(`La cadena ingresada [${_isMutant}] es mutante`,'Alerta Mutante!!');
    return;
  }


  this.GetDiags();
  _isMutant =this.IsMutant();

  if (_isMutant.length>0){
    this.toastr.warning(`La cadena ingresada [${_isMutant}] es mutante`,'Alerta Mutante!!');
    return;
  }

  this.toastr.success('La cadena ingresada es humana', 'Actividad Normal!!');
 }

  public IsMutant():string[]{
    for (const _secuencia of this._matriz)
    {
      const _result = this.validarSecuencia(_secuencia);
      if (_result)
        return _secuencia;
    };

    return [];
  }

  public validarSecuencia(_secuencia: string[]):boolean{
    let _repeat :number=1;
    let _step :number=0;
    let _base :string='';
    for (const  _car of _secuencia)
    {
      if (_step>0)
      {
        if(_base == _car)
        {
          _repeat++;
        }else{
          _repeat =1;
        }
      }
      
      _base = _car;
      _step++;

      if (_repeat >=4)
        break;
    }
    return (_repeat >=4);
  }

  public GenerarMatriz(){
    let idx =0;
    this._matriz = [];
    for(const x of this._adn){
      this._matriz[idx] =x.split('');
      idx++;
    }
  }

  public invertirMatriz (){
    const filas = this._adn.length;
    const columnas = this._adn[0].length;
    this._matriz = [];
    let _temp : string[]=[];
    for (let i = 0; i < columnas; i++) {
      for (let j = 0; j < filas; j++) {
        const caracteres = this._adn[j].split('');
        _temp.push( caracteres[i]);
      }
      this._matriz[i] = _temp;
      _temp =[];
    }
  }

  public GetDiags(){
    let _forward :boolean = false;
    const _colQty = this._adn[0].length;

    let _matrizTemp:string[][] = [];
    let _temp : string[]=[];
    for (let x = 0; x < _colQty; x++) {
        let char =this._matriz[x][x];
        _temp.push( char);
    } 

    _matrizTemp.push( _temp);
    _temp =[];
    for (let x = 5; x >=0; x--) {
      for (let y = 0; y <6; y++) {
        let char =this._matriz[x][y];
        _temp.push( char);
      }
    }
    _matrizTemp.push( _temp);
    this._matriz=[];
    this._matriz = _matrizTemp;
  }
}


