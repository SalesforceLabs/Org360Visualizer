import { LightningElement, track, wire } from 'lwc';
import RetrieveDependencies from '@salesforce/apex/MetadataSelectorController.RetrieveDependencies';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

import { createsvg } from 'c/edgebundling';

import { loadScript } from 'lightning/platformResourceLoader';
import D3 from '@salesforce/resourceUrl/d3';


export default class Visualizer extends LightningElement 
{
    @wire(CurrentPageReference) pageRef;
    @track results;
    @track chart;
    d3Initialized = false;

    renderedCallback() {
        
        if (this.d3Initialized) {
            return;
        }
        this.d3Initialized = true;

        Promise.all([
            loadScript(this, D3 + '/d3.min.js')
        ])
        .then(() => {
            this.initializeD3();
        })
        .catch(error => {
            console.log('failed: ' + error);
        });
    }

    initializeD3() {
        console.log('loaded');
    }

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
        RetrieveDependencies({selectedMetadata: selectedMetadata})
        .then(result => {
            this.results = result;
            let data = JSON.parse(result);
            var svg = d3.select(this.template.querySelector('svg.d3'));
            
            createsvg(d3, data, svg);
        })
        .catch(error => {
            console.log(error);
            this.error = error.body.message;
        });
    }
}