package com.example.veterinarinary.DTO;

public class clientDTO {
    private String clientName ;
    private String phone;

    public clientDTO(String clientName, String phone) {
        this.clientName = clientName;
        this.phone = phone;
    }

    public String getclientName()    {
        return clientName;
    }

    public void setclientName(String clientName) {
        this.clientName = clientName;
    }

    public String getphone() {
        return phone;
    }

    public void setphone(String phone) {
        this.phone = phone;
    }
    
}
