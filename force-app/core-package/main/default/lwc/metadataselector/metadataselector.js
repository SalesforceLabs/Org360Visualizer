import { LightningElement, track, wire } from 'lwc';
import { fireEvent, registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class Metadataselector extends LightningElement 
{
    @wire(CurrentPageReference) pageRef;
    @track selectedMetadata = '';
    @track name = '';
    @track referenceMetadataTypes = [];
    @track availableReferenceMetadataTypes = [];
    @track hasMetadata = false;
    @track hasReferenceMetadata = false;

    get metadataTypes() {
        var options = new Array();
        this.availableReferenceMetadataTypes.forEach(p => {
            options.push({ label: p.name + ' (' + p.count + ')', value: p.name });
        });
        return options;
        /*return [
            { label: 'ApexClass', value: 'ApexClass' },
            { label: 'LightningComponentBundle', value: 'LightningComponentBundle' },
            { label: 'WebLink', value: 'WebLink' }
        ];*/
    }

    get selectedValues() {
        if(this.referenceMetadataTypes.length > 0) {
            var md = '\'' + this.referenceMetadataTypes.join('\',\'') + '\'';
            console.log(md);
            return md;
        }
        return '';
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
        registerListener('metadataTypes', this.handleMetadataTypes, this);
    }

    handleMetadataClick(detail) {
        console.log('n: ' + detail.name);
        console.log('p: ' + detail.parent);
        this.selectedMetadata = detail.parent;
        this.name = detail.name;
        this.hasMetadata = true;
    }

    handleMetadataTypes(types) {
        console.log('t: ' + types);
        
        this.availableReferenceMetadataTypes = types;
        
        if(!this.hasReferenceMetadata) {
            types.forEach(p => {
                this.referenceMetadataTypes.push(p.name);
            });
        }

        this.hasReferenceMetadata = true;
    }

    handleRemove() {
        this.selectedMetadata = '';
        this.hasMetadata = false;
        this.handleClick();
    }
}