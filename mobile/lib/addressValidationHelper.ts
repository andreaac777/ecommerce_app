export interface AddressFormData {
    label: string;
    fullName: string;
    streetAddress: string;
    city: string;
    phoneNumber: string;
    isDefault: boolean;
}

export const MUNICIPALITIES = [
    "Medellín",
    "Envigado",
    "Itagüí",
    "Sabaneta",
    "La Estrella"
];

export const validateAddressForm = (form: AddressFormData) => {
    const errors: string[] = [];

    if (!form.label.trim()) {
        errors.push("El nombre de la dirección es requerido");
    }

    if (!form.fullName.trim()) {
        errors.push("El nombre del destinatario es requerido");
    } else if (form.fullName.trim().length < 3) {
        errors.push("El nombre debe tener al menos 3 caracteres");
    }

    if (!form.streetAddress.trim()) {
        errors.push("La dirección es requerida");
    }

    if (!form.city) {
        errors.push("Debe seleccionar una ciudad");
    }

    if (!form.phoneNumber) {
        errors.push("El número de celular es requerido");
    } else if (form.phoneNumber.length !== 10) {
        errors.push("El número de celular debe tener 10 dígitos");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const isValidName = (text: string): boolean => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/;
    return regex.test(text);
};
export const sanitizePhone = (text: string): string => {
    const numbers = text.replace(/\D/g, '');
    return numbers.slice(0, 10);
};

export const formatPhoneDisplay = (phone: string): string => {
    if (!phone) return "";
    
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `${phone.slice(0, 3)} ${phone.slice(3)}`;
    return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6, 10)}`;
};