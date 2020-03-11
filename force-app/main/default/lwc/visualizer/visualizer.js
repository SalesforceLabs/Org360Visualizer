import { LightningElement, track, wire } from 'lwc';
import RetrieveDependencies from '@salesforce/apex/MetadataSelectorController.RetrieveDependencies';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

export default class Visualizer extends LightningElement 
{
    @wire(CurrentPageReference) pageRef;
    @track results;

    disconnectedCallback() {
        // unsubscribe from searchKeyChange event
        unregisterAllListeners(this);
    }

    connectedCallback() {
        // subscribe to searchKeyChange event
        registerListener('metadataChange', this.handleMetadataChange, this);
    }

    handleMetadataChange(metadata) {
        let selectedMetadata = metadata;
        console.log(selectedMetadata);
        RetrieveDependencies({selectedMetadata: selectedMetadata})
        .then(result => {
            this.results = result;
            let data = JSON.parse(result);
        })
        .catch(error => {
            this.error = error.body.message;
    });
    }
}