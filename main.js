'use strict';

// モーダルウインドウ
Vue.use(window["vue-js-modal"].default);

new Vue({
    el: '#app',
    vuetify: new Vuetify(),

    data() {
        return {
          todos:[],
          newTodo: '',
          newDeadLine:'',
          errors:[]     
        }
    },
    
    watch:{
        todos:{
          handler(){
            localStorage.setItem('todos',JSON.stringify(this.todos));
          },
          deep:true
        }
    },
    
    mounted: function() {
      this.todos = JSON.parse(localStorage.getItem('todos')) || [];
    },
    
    methods:{
        showModal(){
            this.$modal.show('todo-modal');
        },

        hideModal(){
          this.$modal.hide('todo-modal');
        },
        addTodo(){
          this.errors = [];
          if(!this.newTodo){
              this.errors.push('※Todo名は必須項目です');
          }
          if(!this.errors.length){
            let item = {
              name: this.newTodo,
              status: 'isDone',
              deadLine:this.getDeadLine(),
            }
    
            this.todos.push(item);
            this.newTodo = '';
            this.newDeadLine = '';
            this.hideModal();
          }
        },
        
        deleteTodo(index){
          if(confirm('リストから削除しますか？')){
            this.todos.splice(index, 1);
          }
        },
        
        //isDone===trueのtodoはリストから削除
        purge(){
          if(!confirm('すべての「完了」のTodoをリストから削除しますか？')){
            return;
          }
          this.todos = this.remaining;
        },
        
        //期限を表示
        getDeadLine(){
          if(!this.newDeadLine){
            return '未設定';
          }
          let deadLine = new Date(this.newDeadLine);
          let month = String(deadLine.getMonth() + 1).padStart(2,'0');
          let date = String(deadLine.getDate()).padStart(2, '0');
          return `${month}-${date}`;
        }
    },
    
    computed:{
        //ステータスが「未対応」「対応中」になっているTodoの配列を作成
        remaining(){
          return this.todos.filter(function(todo){
            return todo.status !== 'done';
          });
        },
        //ステータスが「対応中」になっているTodoの配列を作成
        running(){
          return this.todos.filter(function(todo){
            return todo.status === 'running';
          });
        }
  
  
    },   
})