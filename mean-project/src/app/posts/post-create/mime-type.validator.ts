import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

// Returns either a Promise or Observable with a dynamic key name with any value
export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
    const file = control.value as File;
    const fileReader = new FileReader();
    // Need to return an observable so the onload type function in post-create won't work here
    const frObs = Observable.create((observer: Observer<{ [key: string]: any }>) => {
       // equivalten to fileReader.onloadend outsite of an observable
        fileReader.addEventListener('loadend', () => {
            // New array of unsigned 8 bit integers
            // Allows for reading the file data to truly check if the file is an image
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
            let header = '';
            let isValid = false;
            for (let i = 0; i < arr.length; i++) {
                // Build converted hex string
                header += arr[i].toString(16);
            }
            // Check for certain hex strings to verify that the file has the correct mime-type
            // to be an image
            switch (header) {
                case '89504e47':
                    isValid = true;
                    break;
                case 'ffd8ffe0':
                case 'ffd8ffe1':
                case 'ffd8ffe2':
                case 'ffd8ffe3':
                case 'ffd8ffe8':
                    isValid = true;
                    break;
                default:
                    isValid = false;
                    break;
            }
            if (isValid) {
                // Emitting null means that the image is valid
                observer.next(null);
            } else {
                // Emit an error
                observer.next({ invalidMimeType: true });
            }
            // No more values from this observer
            observer.complete();
        });
        // read in the file as array buffer to access mime-type
        fileReader.readAsArrayBuffer(file);
    });
    return frObs;
};
