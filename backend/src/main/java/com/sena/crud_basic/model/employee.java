package com.sena.crud_basic.model;

 import jakarta.persistence.Column;
 import jakarta.persistence.Entity;
 import jakarta.persistence.GeneratedValue;
 import jakarta.persistence.GenerationType;
 import jakarta.persistence.Id;

 /*
  * Agregamos la anotacion bean intity
  *Para indicar que la clase es una entidad
  */


 @Entity (name="employee")
public class employee {
    /*
     * atributos o columnas de la entidad
     */
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     @Column(name="id_employee") 
     private int id_employee;

     @Column(name="first_name",length = 30,nullable = false)
     private String first_name;

     @Column(name="phone",length = 11,nullable = false)
     private String phone;

     //constructor
     public employee (int id_employee,String first_name ,String phone ){
        this.id_employee = id_employee;
        this.first_name = first_name;
        this.phone = phone;
     }

     //get del ID  
     public int getId_employee() {
        return id_employee;
     }

     //set del ID 
     public void setId_employee(int id_employee){
        this.id_employee=id_employee;
     }

    //get del firstName  
    public String get_first_name() {
      return first_name;
     }
    
     //set del firstName 
    public void set_first_name(String first_name){
         this.first_name=first_name;
     }

      //get del phone  
    public String get_phone() {
        return phone;
       }
      
     //set del phone 
    public void set_phone(String phone){
       this.phone=phone;
    }


}
