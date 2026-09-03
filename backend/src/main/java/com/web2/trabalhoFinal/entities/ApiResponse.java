package com.web2.trabalhoFinal.entities;

public class ApiResponse<T> {

    private T data;
    private String mensage;
    private boolean sucess;

    public ApiResponse(){
    }

    public ApiResponse(T data, String mensage, boolean sucess){
        this.data = data;
        this.mensage = mensage;
        this.sucess = sucess;
    }

    public ApiResponse(String mensage, boolean sucess){
        this.mensage = mensage;
        this.sucess = sucess;
    }

    public T getData(){
        return data;
    }

    public void setData(T data){
        this.data = data;
    }

    public String getMensage(){
        return this.mensage;
    }

    public void setMessage(String mensage) {
        this.mensage = mensage;
    }

    public boolean isSucess() {
        return sucess;
    }

    public void setSucess(boolean sucess)
    {
        this.sucess = sucess;
    }

}
// Api para padronizar as resposas enviadas para o front, retonar o objeto e true
// se a ação foi feita corretamente, e mensagem e false explicando porque deu
// errado caso ação não tenha sido concluida.