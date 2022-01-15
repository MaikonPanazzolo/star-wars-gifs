<template>
    <sui-container fluid>
        <sui-container text-align="center" class="search-box">
            <h1 is="sui-header">
                Welcome to the Republic
            </h1>
            <p>The galaxy needs you to bring the balance to the force</p>
            <sui-divider hidden clearing></sui-divider>
            <sui-form>
                <sui-form-field>
                    <sui-input size="huge" placeholder="Search for rebels" icon="search" id="search" v-model="search" @keydown.enter.prevent="getGalaxyHeroes(true)" />
                </sui-form-field>
                <div>
                    <sui-button primary size="large" type="button" @click="modalLuke = true">
                        Feeling Luke
                    </sui-button>
                    <sui-button primary size="large" @click="getGalaxyHeroes(true)" type="button">
                        Search
                    </sui-button>
                    <sui-modal v-model="modalLuke">
                        <sui-modal-content image>
                            <img src="../assets/luke.gif" class="ui image"/>
                            <sui-modal-description>
                                <p>
                                    You've got a feeling Luke and had discovered my secret. If you like this project, you can use to learn more about the force and,
                                    if you want to use it, you can help me to make it better.

                                    <br>
                                    <br>

                                    You can contact me at <a href="mailto:maikon.panazzolo@gmail.com">maikon.panazzolo@gmail.com</a> for more information.

                                    <br>
                                    <br>

                                    I hope you enjoy this project. May the force be with you.

                                </p>
                            </sui-modal-description>
                        </sui-modal-content>
                    </sui-modal>
                </div>
            </sui-form>
        </sui-container>
        <sui-divider hidden clearing></sui-divider>
        <sui-container fluid class="mosaic">
            <heroes v-for="g in galaxy" :hero="g" :key="g.id"></heroes>
        </sui-container>
        <transition name="fade">
            <sui-button circular id="toTop" icon="chevron up big" @click="toTop" v-if="showTopButton"></sui-button>
        </transition>
    </sui-container>
</template>

<script>
import axios from "axios";
import Heroes from '../components/Heroes.vue';
export default {
    name: 'Republic',

    components: {
        Heroes,
    },

    data() {
        return {
            galaxy: [],
            selectedHero: null,
            modalOpen: false,
            loading: false,
            numberOfHeroes: 0,
            search: '',
            showTopButton: false,
            modalLuke: false,
        }
    },

    beforeMount() {
        window.scrollTo(0, 0);
        this.getGalaxyHeroes();
    },

    mounted() {
        this.getNextGalaxyHeroes();

        new IntersectionObserver(entries => {
            entries.forEach(entry => {
                this.showTopButton = entry.isIntersecting == false;
            });
        }).observe(document.getElementById('search'));        
    },

    methods: {
        getGalaxyHeroes(clearBefore = false) {
            this.loading = true;

            let defaultSearch = 'star wars';
            let fullSearch = encodeURIComponent(this.search + ' ' + defaultSearch);

            axios.get(`https://api.giphy.com/v1/gifs/search?api_key=ti7hwJ69BOg8nBlw6xKq1FJGKZOIBEZO&q=${fullSearch}&limit=100&offset=${this.galaxy.length}&rating=G&lang=en&page=${this.currentPage}`)
                .then(response => {
                    this.galaxy = clearBefore ? response.data.data : this.galaxy.concat(response.data.data)
                    this.numberOfHeroes = response.data.pagination.total_count;
                    this.loading = false;
                })
                .catch(error => {
                    this.loading = false;
                })
        },

        getNextGalaxyHeroes() {
            window.onscroll = () => {
                if (document.documentElement.scrollTop > 0) {
                    let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 600;
                    if (bottomOfWindow) {
                        if (this.loading || (this.loading == false && this.numberOfHeroes == 0)) return;
                        this.getGalaxyHeroes();
                    }
                }
            }
        },

        toTop() {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        },
    }
}
</script>
<style lang="scss" scoped="true">
    .search-box {
        margin: 15rem 0rem;

        .ui.header {
            color: #fed34f;
            color: #fed34f;
            font-size: 3.5em;

            +p {
                color: #24b9dd;
                font-size: 1.5em;
            }

            @media only screen and (max-width: 768px) {
                font-size: 2.5em;
            }
        }
    }

    .mosaic {
        column-count: 4;
        column-gap: 1em;
        position: relative;
        z-index: 1;
        padding: 1.5em;

        @media screen and (max-width: 768px) {
            column-count: 3;
        }

        @media screen and (max-width: 580px) {
            column-count: 2;
        }

        @media screen and (max-width: 420px) {
            column-count: 1;
        }
    }

    #toTop {
        position: fixed;
        bottom: 1em;
        right: 1em;
        z-index: 2;
        background-color: #24b9dd;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 300ms;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }    
</style>