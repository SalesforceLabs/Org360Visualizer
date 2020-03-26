import { LightningElement, track, wire } from 'lwc';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class Metadataselector extends LightningElement 
{
    @wire(CurrentPageReference) pageRef;
    @track selectedMetadata;

    handleChange(event) {
        this.selectedMetadata = event.target.value;
    }

    handleClick() {
        fireEvent(this.pageRef, 'metadataChange', this.selectedMetadata);
    }
}