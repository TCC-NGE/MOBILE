// #include <iostream>
// #include <vector>
// #include <string>
// #include <iomanip>
#include <SPI.h>
#include <MFRC522.h>
#include <LiquidCrystal_I2C.h>
 
#define LED_VERDE 8
#define LED_VERMELHO 5
#define SS_PIN 10
#define RST_PIN 6
#define BUZZER 7
LiquidCrystal_I2C lcd(0x27, 16, 2);
String IDtag = ""; //Variável que armazenará o ID da Tag
bool Permitido = false; //Variável que verifica a permissão
//Vetor responsável por armazenar os ID's das Tag's cadastradas
String TagsCadastradas[] = {"e364ce34",
                            "1234",
                            " 1"};
MFRC522 LeitorRFID(SS_PIN, RST_PIN);    // Cria uma nova instância para o leitor e passa os pinos como parâmetro
void setup() {
        Serial.begin(9600);           // Inicializa a comunicação Serial
        SPI.begin();                  // Inicializa comunicacao SPI
        LeitorRFID.PCD_Init();        // Inicializa o leitor RFID
        pinMode(LED_VERDE, OUTPUT);   // Declara o pino do led verde como saída
        pinMode(LED_VERMELHO, OUTPUT);
        pinMode(BUZZER, OUTPUT); // Declara o pino do led vermelho como saída     // Declara o pino do buzzer como saída
}
void loop() {  
  Leitura();  //Chama a função responsável por fazer a leitura das Tag's
}
void Leitura(){
      lcd.init();
      lcd.init();
      lcd.backlight();
      lcd.clear();
      lcd.print("Aproxime o ");
      lcd.setCursor(0,1);
      lcd.print("Cartao");
      
        IDtag = ""; //Inicialmente IDtag deve estar vazia.
       
        // Verifica se existe uma Tag presente
        if ( !LeitorRFID.PICC_IsNewCardPresent() || !LeitorRFID.PICC_ReadCardSerial() ) {
            delay(50);
            return;
        }
       
        // Pega o ID da Tag através da função LeitorRFID.uid e Armazena o ID na variável IDtag        
        for (byte i = 0; i < LeitorRFID.uid.size; i++) {        
            IDtag.concat(String(LeitorRFID.uid.uidByte[i], HEX));
        }        
       
        //Compara o valor do ID lido com os IDs armazenados no vetor TagsCadastradas[]
        for (int i = 0; i < (sizeof(TagsCadastradas)/sizeof(String)); i++) {
          if(  IDtag.equalsIgnoreCase(TagsCadastradas[i])  ){
              Permitido = true; //Variável Permitido assume valor verdadeiro caso o ID Lido esteja cadastrado
             
          }
        }      
        if(Permitido == true) acessoLiberado(); //Se a variável Permitido for verdadeira será chamada a função acessoLiberado()        
        else acessoNegado(); //Se não será chamada a função acessoNegado()
        delay(1000); //aguarda 2 segundos para efetuar uma nova leitura
}
void acessoLiberado(){
  Serial.println("Tag Cadastrada: " + IDtag); //Exibe a mensagem "Tag Cadastrada" e o ID da tag não cadastrada
  lcd.init();
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.print("Acesso Liberado!");
    efeitoPermitido();  //Chama a função efeitoPermitido()
    Permitido = false;  //Seta a variável Permitido como false novamente
  
}
void acessoNegado(){
  Serial.println("Tag NAO Cadastrada: " + IDtag); //Exibe a mensagem "Tag NAO Cadastrada" e o ID da tag cadastrada
  lcd.init();
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.print("Acesso Negado:(");
    efeitoNegado();
   
}
void efeitoPermitido(){  
  int qtd_bips = 2; //definindo a quantidade de bips
  for(int j=0; j<qtd_bips; j++){
    //Ligando o buzzer com uma frequência de 1500 hz e ligando o led verde.
    digitalWrite(LED_VERDE, HIGH);  
    tone(BUZZER, 1300, 100);
    delay(300);  
   
    //Desligando o buzzer e led verde.      
    digitalWrite(LED_VERDE, LOW);
    delay(100);
  }  
}
void efeitoNegado(){  
  int qtd_bips = 1;  //definindo a quantidade de bips
  for(int j=0; j<qtd_bips; j++){  
    //Ligando o buzzer com uma frequência de 500 hz e ligando o led vermelho.
    digitalWrite(LED_VERMELHO, HIGH);
    tone(BUZZER, 1200, 500);
    delay(1000);
     
    //Desligando o buzzer e o led vermelho.
    digitalWrite(LED_VERMELHO, LOW);
    delay(100);
  }  
 
}