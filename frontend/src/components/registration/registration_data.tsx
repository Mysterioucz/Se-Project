// export map to correct data of registration form (Email, Name, Lastname, Password) I will use this to correct data in every step of registration

// Use localStorage to persist registration data across page reloads

const REGISTRATION_DATA_KEY = "registrationData";

function loadRegistrationData(): { [key: string]: string } {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem(REGISTRATION_DATA_KEY);
        return data
            ? JSON.parse(data)
            : {
                  email: "",
                  firstName: "",
                  lastName: "",
                  password: "",
              };
    }
    // SSR fallback: return empty/default values
    return {
        email: "",
        firstName: "",
        lastName: "",
        password: "",
    };
}

export const registrationData: { [key: string]: string } = loadRegistrationData();

export function saveRegistrationData(data: { [key: string]: string }) {
    Object.assign(registrationData, data);
    if (typeof window !== 'undefined') {
        localStorage.setItem(REGISTRATION_DATA_KEY, JSON.stringify(registrationData));
    }
}