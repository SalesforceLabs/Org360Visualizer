import { LightningElement, track, wire } from 'lwc';
import { fireEvent, registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class Metadataselector extends LightningElement 
{
    @wire(CurrentPageReference) pageRef;
    @track selectedMetadata = '';
    @track referenceMetadataTypes = ['ApexClass', 'LightningComponentBundle'];

    get metadataTypes() {
        return [
            { label: 'ApexClass', value: 'ApexClass' },
            { label: 'LightningComponentBundle', value: 'LightningComponentBundle' },
            { label: 'WebLink', value: 'WebLink' }
        ];
    }

    get selectedValues() {
        return '\'' + this.referenceMetadataTypes.join('\',\'') + '\'';
    }

    handleCheckboxChange(e) {
        this.referenceMetadataTypes = e.detail.value;
    }

    handleChange(event) {
        this.selectedMetadata = event.target.value;
    }

    handleClick() {
        fireEvent(this.pageRef, 'metadataChange', { selectedMetadata: this.selectedMetadata, referenceMetadataTypes: this.selectedValues });
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    connectedCallback() {
        registerListener('metadataClick', this.handleMetadataClick, this);
    }

    handleMetadataClick(parent) {
        console.log('d: ' + parent);
        this.selectedMetadata = parent;
    }
}