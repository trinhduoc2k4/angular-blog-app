import { FormGroup } from "@angular/forms";


export function checkTitle(titleControl: string, input: any) {
    return (formgroup: FormGroup) => {
        const title = formgroup.controls[titleControl];
        // console.log(input);
        
        let titleValue = title.value;
        if(titleValue.errors) {
            return;
        }
        if(input.some((item: any) => item.title === titleValue)) {
            return title.setErrors({wrongTitle: true});
        }
    }
}