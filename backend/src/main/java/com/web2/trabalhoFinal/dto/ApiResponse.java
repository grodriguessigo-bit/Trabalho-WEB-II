package com.web2.trabalhoFinal.dto;

public class ApiResponse<T> {

    private T data;
    private String message;
    private boolean success;

    public ApiResponse(){
    }

    public ApiResponse(T data, String message, boolean success){
        this.data = data;
        this.message = message;
        this.success = success;
    }

    public ApiResponse(String message, boolean success){
        this.message = message;
        this.success = success;
    }

    public T getData(){
        return data;
    }

    public void setData(T data){
        this.data = data;
    }

    public String getMessage(){
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success)
    {
        this.success = success;
    }

}
// Api para padronizar as resposas enviadas para o front, retonar o objeto e true
// se a ação foi feita corretamente, e messagem e false explicando porque deu
// errado caso ação não tenha sido concluida.