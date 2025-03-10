    package com.example.veterinarinary.DTO;

    public class treatmentDTO {

        private String treatmentName;
        private String treatmentDescription;

        // Constructor vacío (necesario para frameworks como Spring)
        public treatmentDTO() {}

        // Constructor con parámetros
        public treatmentDTO(String treatmentName, String treatmentDescription) {
            this.treatmentName = treatmentName;
            this.treatmentDescription = treatmentDescription;
        }

        // Getters y Setters
        public String getTreatmentName() {
            return treatmentName;
        }

        public void setTreatmentName(String treatmentName) {
            this.treatmentName = treatmentName;
        }

        public String getTreatmentDescription() {
            return treatmentDescription;
        }

        public void setTreatmentDescription(String treatmentDescription) {
            this.treatmentDescription = treatmentDescription;
        }
    }
