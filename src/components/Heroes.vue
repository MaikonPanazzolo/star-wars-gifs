<template>
    <div class="hero">
        <img :src="hero.images.original.url" :alt="hero.title" @click="$emit('click')">
        <div class="controls" v-show="ready">
            <button type="button" class="action-hero" @click="openHeroInfo" data-tooltip="Details" data-position="bottom right">
                <sui-icon name="clipboard list" size="large" color="yellow"></sui-icon>
            </button>
            <button type="button" class="action-hero" @click="downloadHero" data-tooltip="Download" data-position="bottom right">
                <sui-icon name="download" size="large" color="yellow"></sui-icon>
            </button>
            <template v-if="saved">
                <button type="button" class="action-hero" @click="destroyHero" data-tooltip="Destroy" data-position="bottom right">
                        <sui-icon name="trash" color="yellow" size="large"></sui-icon>
                </button> 
                <button type="button" class="action-hero" @click="openHeroEdit" data-tooltip="Edit" data-position="bottom right">
                        <sui-icon name="edit" color="yellow" size="large"></sui-icon>
                </button>                 
            </template>
            <template v-else>
                <button type="button" class="action-hero" @click="openHeroSave" data-tooltip="Save" data-position="bottom right">
                        <sui-icon name="heart" color="yellow" size="large"></sui-icon>
                </button> 
            </template>
        </div>
        <sui-modal v-model="modalInfoOpen">
            <sui-modal-header>A little about this hero</sui-modal-header>
            <sui-modal-content image>
                <sui-image
                    wrapped
                    :src="hero.images.original.url"
                    />
                <sui-modal-description>
                    <h3 is="sui-header">
                        {{ hero.title }}
                    </h3>         
                    <sui-list relaxed>
                        <sui-list-item>
                            <sui-list-content>
                                <sui-list-header>Id</sui-list-header>
                                <sui-list-description>{{ hero.id }}</sui-list-description>
                            </sui-list-content>
                        </sui-list-item>
                        <sui-list-item>
                            <sui-list-content>
                                <sui-list-header>Type</sui-list-header>
                                <sui-list-description>{{ hero.type }}</sui-list-description>
                            </sui-list-content>
                        </sui-list-item>
                        <sui-list-item>
                            <sui-list-content>
                                <sui-list-header>Size</sui-list-header>
                                <sui-list-description>{{ sizeConverted }}</sui-list-description>
                            </sui-list-content>
                        </sui-list-item>
                        <sui-list-item>
                            <sui-list-content>
                                <sui-list-header>Link</sui-list-header>
                                <sui-list-description><a :href="hero.url" target="_blank">{{ hero.url }}</a></sui-list-description>
                            </sui-list-content>
                        </sui-list-item>
                    </sui-list>           
                </sui-modal-description>
            </sui-modal-content>
            <sui-modal-actions>
                <sui-button primary @click="openHeroInfo">
                    OK
                </sui-button>
            </sui-modal-actions>
        </sui-modal>
        <sui-modal v-model="modalSaveOpen">
            <sui-modal-header>About hero</sui-modal-header>
            <sui-modal-content>
                <sui-form v-if="modalSave">
                    <sui-form-field>
                        <label>Name</label>
                        <sui-input type="text" placeholder="Name" v-model="modalSave.title" />
                    </sui-form-field>
                    <sui-form-field>
                        <label>Link</label>
                        <sui-input type="text" placeholder="Height" v-model="modalSave.url" />
                    </sui-form-field>
                </sui-form>
            </sui-modal-content>
            <sui-modal-actions>
                <sui-button basic negative @click="modalSaveOpen = false">Cancel</sui-button>
                <sui-button primary @click="saveHero">Save</sui-button>
            </sui-modal-actions>            
        </sui-modal>        
    </div>
</template>
<script>
export default {
    props: {
        hero: {
            type: Object,
            required: true
        },
    },

    data() {
        return {
            ready: false,
            saved: false,
            modalInfoOpen: false,
            modalSaveOpen: false,
            modalSave: {
                name: this.hero.title,
                url: this.hero.url,
                id: this.hero.id,
            },
        }
    },

    computed: {
        selectedHeroes() {
            return this.$store.state.selectedHeroes
        },

        sizeConverted() {
            let size = this.hero.images.original.size;
            if (size < 1024) {
                return `${size} bytes`;
            } else if (size < 1048576) {
                return `${(size / 1024).toFixed(2)} KB`;
            } else {
                return `${(size / 1048576).toFixed(2)} MB`;
            }            
        }
    },

    mounted() {
        let img = new Image();
        img.onload = () => {
            this.ready = true;
        }

        img.src = this.hero.images.original.url;
    },

    methods: {
        openHeroSave() {
            if (this.selectedHeroes[this.hero.id]) {
                this.modalSave = {
                    title: this.selectedHeroes[this.hero.id].title,
                    url: this.selectedHeroes[this.hero.id].url,
                    id: this.selectedHeroes[this.hero.id].id,
                };
            } else {
                this.modalSave = {
                    title: this.hero.title,
                    url: this.hero.url,
                    id: this.hero.id,
                };
            }

            this.modalSaveOpen = true;
        },

        openHeroEdit() {
            this.modalSave = {
                title: this.selectedHeroes[this.hero.id].title,
                url: this.selectedHeroes[this.hero.id].url,
                id: this.selectedHeroes[this.hero.id].id,
            };
            this.modalSaveOpen = true;
        },

        saveHero() {
            this.$store.commit('addSelectedHero', this.modalSave);
            this.saved = true;
            this.modalSaveOpen = false;
        },

        destroyHero() {
            this.$store.commit('removeSelectedHero', this.modalSave);
            this.saved = false;
        },

        openHeroInfo() {
            this.modalInfoOpen = !this.modalInfoOpen;
        },

        downloadHero() {
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function() {
                let a = document.createElement('a');
                a.href = window.URL.createObjectURL(xhr.response);
                a.download = this.hero.title;
                a.click();
            }.bind(this);

            xhr.open('GET', this.hero.images.original.url);
            xhr.send();
        }
    }
}
</script>
<style lang="scss" scoped="true">
    .hero {
        column-count: 1;
        margin: 0 0 1em;
        display: inline-block;
        width: 100%;
        position: relative;

        img {
            border-radius: 4px;
            display: inline-block;
            width: 100%;
        }

        .controls {
            position: absolute;
            top: 0px;
            right: 0px;
            padding: 0.5em;

            .action-hero {
                background-color: transparent;
                border: none;
                outline: none;
                cursor: pointer;
            }

            .icon {
                transition: all 0.3s ease-in-out;
            }
        }
    }

    .ui.list {
        > .item {
            padding: 8px 0px;

            .header {
                margin-bottom: 5px;
            }
        }
    }
</style>