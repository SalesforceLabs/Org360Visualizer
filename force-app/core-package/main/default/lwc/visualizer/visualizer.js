import { LightningElement, track, wire } from 'lwc';
import RetrieveDependencies from '@salesforce/apex/MetadataSelectorController.RetrieveDependencies';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

import { createsvg } from 'c/edgebundling';

import { loadScript } from 'lightning/platformResourceLoader';
import D3 from '@salesforce/resourceUrl/d3';


export default class Visualizer extends LightningElement 
{
    @wire(CurrentPageReference) pageRef;
    @track results;
    @track chart;
    @track types = [];

    @track refTypes;
    @track metadataType;
    d3Initialized = false;

    renderedCallback() {
    
        document.addEventListener('customEvent', e => {
            var name = e.detail.name;
            var parent = e.detail.parent;
            this.metadataType = parent;
            this.fetchResults();
            
            fireEvent(this.pageRef, 'metadataClick', { name: name, parent: parent });
        });

        document.addEventListener('errorEvent', e => {
            var message = e.detail.message;
            const errorToast = new ShowToastEvent({
                title: 'No Filter Available',
                message: message
            });
            this.dispatchEvent(errorToast);
        });

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
        unregisterAllListeners(this);
    }

    connectedCallback() {
        registerListener('metadataChange', this.handleMetadataChange, this);
    }

    handleMetadataChange(detail) {
        this.metadataType = detail.selectedMetadata;
        this.refTypes = detail.referenceMetadataTypes;
        this.fetchResults();
    }

    fetchResults() {
        RetrieveDependencies({ selectedMetadata: this.metadataType, referenceMetadataTypes: this.refTypes })
        .then(result => {
            this.results = result;
            let data = JSON.parse(result);
            var svg = d3.select(this.template.querySelector('svg.d3'));
            createsvg(d3, data, svg);
            this.returnData(data);
        })
        .catch(error => {
            console.log(error);
        });
    }

    returnData(data) {
        console.log(data);
        
        if(this.types.length == 0){
            data.records.forEach(element => {
                if (!this.types.some(p => p.name === element.RefMetadataComponentType)) {
                    this.types.push({ name: element.RefMetadataComponentType, count: 0 });
                }
            });

            this.types.sort(p => p.name);
        }

        this.types.forEach(p => {
            p.count = 0;
            data.records.forEach(q => {
                if(q.RefMetadataComponentType == p.name) {
                    p.count++;
                }
            });
        });

        fireEvent(this.pageRef, 'metadataTypes', this.types);
    }
}