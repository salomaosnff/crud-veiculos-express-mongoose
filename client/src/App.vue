<template>
  <v-app>
    <v-content>
      <v-toolbar dark fixed color="grey darken-4">
        <v-icon>directions_car</v-icon>
        <v-toolbar-title class="white--text">Gerenciador de Veículos</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          light
          solo
          prepend-icon="search"
          placeholder="Buscar"
          class="search-input"
          @input.native="typing()"
          @keydown.native.enter="search()"
          v-model="searchTerm"
        />
      </v-toolbar>
      <v-container grid-list-md class="mt-5">
        <header class="d-flex flex-end">
          <h1 class="display-1 mt-4 mb-2 f1">Veículo</h1>
          <v-btn 
            fab 
            small 
            dark 
            color="grey darken-4"
            class="f0"
            @click.native="create"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </header>
        <v-divider />
        <v-layout row wrap class="mt-2">
          <v-flex xs12 md6>
            <h3 class="title mt-3 mb-1">Lista de veículos</h3>

            <v-layout row justify-space-between align-center>
              <v-flex xs4>
                <v-text-field type="number" min="1" max="100" v-model="pagination.limit" label="Limite" />
              </v-flex>
              <v-flex xs4>
                <v-text-field type="number" min="0" v-model="pagination.offset" label="Iniciar a partir" />
              </v-flex>
              <v-flex xs3 class="text-xs-right">
                <v-btn class="mx-0" small color="primary" dark @click.native="search()">Atualizar</v-btn>
              </v-flex>
            </v-layout>
            
            <v-card v-for="(veiculo, i) in veiculos" :key="veiculo._id"
              class="mb-3"
              ripple 
              hover 
              @click.native="open(i)"
              >
              <v-card-text class="d-flex">
                <div class="f1">
                  <p class="ma-0 subheading">{{ veiculo.marca }}</p>
                  <p class="ma-0 primary--text">{{ veiculo.veiculo }}</p>
                  <p class="ma-0 body-2">{{ veiculo.ano }}</p>
                </div>
                <v-icon :class="['f0', veiculo.vendido ? 'primary--text' : 'grey--text']">shopping_cart</v-icon>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 md6>
            <h3 class="title my-3">Detalhes</h3>
            <v-card>
              <v-card-title class="title primary--text">{{ current.veiculo }}</v-card-title>
              <v-card-text>
                <div class="d-flex">
                  <p class="marca">
                    <strong>Marca</strong><br>
                    <span class="body-2 grey--text">{{ current.marca }}</span>
                  </p>
                  <p class="ano">
                    <strong>Ano</strong><br>
                    <span class="body-2 grey--text">{{ current.ano }}</span>
                  </p>
                </div>
                <strong>Descrição</strong>
                <p class="descricao">{{ current.descricao }}</p>
              </v-card-text>
              <v-card-actions>
                <v-btn depressed dark @click.native="edit()"><v-icon left dark>edit</v-icon>Editar</v-btn>
                <v-spacer></v-spacer>
                <v-icon :class="current.vendido ? 'primary--text' : 'grey--text'">shopping_cart</v-icon>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

    <!-- Modal Adicionar -->
    <v-dialog v-model="dialog.open" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialog.create ? 'Novo veículo' : 'Editar veículo' }}</span>
        </v-card-title>
        <v-form v-model="dialog.formIsValid">
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6>
                  <v-text-field label="Veículo" :rules="dialog.rules.veiculo" required v-model="dialog.data.veiculo" />
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field label="Marca" required :rules="dialog.rules.marca" v-model="dialog.data.marca" />
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field label="Ano" required :rules="dialog.rules.ano" type="number" min="1900" :max="(new Date()).getFullYear() + 1" v-model="dialog.data.ano"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-checkbox label="Vendido?" v-model="dialog.data.vendido" />
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Descrição" multi-line v-model="dialog.data.descricao" />
                </v-flex>
              </v-layout>
            </v-container>
            <small>*indica campos obrigatórios</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="dialog.open = false">Fechar</v-btn>
            <v-btn color="primary" :disabled="!dialog.formIsValid" flat @click.native="sendForm()">Save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import http from '~/http'

export default {
  name: 'app',
  data () {
    const requiredRule = [ v => !!v || 'Este campo é requerido' ]
    return {
      dialog: {
        open: false,
        create: true,
        data: {
          veiculo: '',
          marca: '',
          ano: '',
          vendido: false,
          descricao: '',
        },
        formIsValid: false,
        rules: {
          veiculo: requiredRule,
          marca  : requiredRule,
          ano    : requiredRule,
        }
      },
      veiculos: [],
      currentIndex: null,
      searchTerm: '',
      searchTimer: null,
      pagination: {
        limit: 10,
        offset: 0,
      }
    }
  },
  methods: {
    loadVeiculos() {
      window.clearInterval(this.searchTimer)

      this.veiculos = []

      http({
        url: '/veiculos',
        params: {
          limite: this.pagination.limit,
          inicio: this.pagination.offset,
        }
      })
      .then(req => {
        this.veiculos = req.data.result
        this.currentIndex = 0
      })
      .catch(err => window.alert(`Erro: ${err.message}`))
    },
    open(index) {
      this.currentIndex = index
    },
    edit(index) {
      this.currentIndex = index || this.currentIndex

      this.dialog.create = false
      this.dialog.data = Object.assign({}, this.veiculos[this.currentIndex])
      this.dialog.open = true
    },
    create() {
      this.dialog.create = true

      this.dialog.data = {
        veiculo: '',
        marca: '',
        ano: '',
        vendido: false,
        descricao: '',
      }

      this.dialog.open = true
    },
    sendForm() {

      if (this.dialog.create) {
        this.postForm()
      } else {
        this.putForm()
      }

      this.dialog.open = false
    },
    putForm() {
      const form = this.dialog.data

      delete form.__v

      http.put(`/veiculos/${form._id}`, form)
      .then(req => {
        this.veiculos.splice(this.currentIndex, 1, req.data.result)
      })
      .catch(err => {
        alert(`Erro: ${ err.message }`)
      })
    },
    postForm(){
      const form = this.dialog.data
      
      http.post(`/veiculos`, form)
      .then(() => this.loadVeiculos())
      .catch(err => window.alert(`Erro: ${ err.message }`))
    },
    search(){
      if (this.searchTerm.length == 0) return this.loadVeiculos()

      this.veiculos = []

      http({
        url: '/veiculos/find',
        params: {
          q: this.searchTerm,
          limite: this.pagination.limit,
          inicio: this.pagination.offset,
        }
      })
      .then(req => {
        this.veiculos = req.data.result
        this.currentIndex = 0
      })
      .catch(err => window.alert(`Erro: ${err.message}`))
    },
    typing(){
      window.clearTimeout(this.searchTimer)
      this.searchTimer = window.setTimeout(() => this.search(), 750)
    }
  },
  mounted() {
    this.loadVeiculos()
  },
  computed: {
    current(){
      if (this.currentIndex >= 0 && this.currentIndex < this.veiculos.length) {
        return this.veiculos[this.currentIndex]
      }

      return {}
    }
  }
}
</script>

<style lang="stylus" src="./stylus/main.styl"></style>
