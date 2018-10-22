<template>
	<el-dialog :show-close="true" :custom-class="'user-dialog'" :visible="dialogvisible" @close="$emit('update:dialogvisible', false)">
  <form enctype="multipart/form-data" id="contactos" >		
		<div class="avatar-box">
		   <img id="imagenContacto" :src="userdata.id ? '/static/images/users/user-'+userdata.id+'.jpg' : imagePlaceholder" @click="clickInputFile" v-show="userdata.id"  alt="user avatar">
        <img :src="image || imagePlaceholder"  v-show="!userdata.id"  />		
    	<div id="photo">   
        <!--<el-input id="image" type="file" @change="onFileSelected"> </el-input>-->
			<input id="files" type="file" @change="onFileChange" accept="image/*" class="input-file">
			</div>
			<div class="star" @click="userdata.starred = !userdata.starred">
				<i class="mdi mdi-star align-vertical-middle" v-if="userdata.starred"></i>
				<i class="mdi mdi-star-outline align-vertical-middle" v-if="!userdata.starred"></i>
			</div>
		</div>
		<div class="form-box">
			<el-input placeholder="Nombre" id="name" name="name" v-model="userdata.name"></el-input>
			<el-input placeholder="Apellidos" id="lastName" name="lastName" v-model="userdata.lastName" ></el-input>
			<el-date-picker v-model="userdata.birthDate" id="birthDate" name="birthDate" type="date" placeholder="Fecha de nacimiento"></el-date-picker>
      <el-input placeholder="Telefono" id="phone" name="phone" v-model="userdata.phone"></el-input>
			<el-input placeholder="Email" id="email" name="email" v-model="userdata.email"></el-input>
			<el-input type="password" id="password" name="password" v-model="userdata.password" auto-complete="off" placeholder="Password" v-show="!userdata._id"></el-input>

      <el-button icon="mdi mdi-account-multiple-plus" type="primary" round v-show="!userdata._id" @click="sendContact();clearForm()"> Añadir</el-button>
			<el-button icon="mdi mdi-cat" type="primary"  round v-show="userdata._id">Actualizar</el-button>
          <vue-snotify></vue-snotify>
		</div>
	</form>
	</el-dialog>
</template>aw

<script>
import { sendContactMail } from "@/api/Contacts";
import {getContacts} from '@/api/Contacts';
import { HalfCircleSpinner } from "epic-spinners";
import {Snotify} from "vue-snotify";

export default {
  name: "UserDialog",
  props: ["userdata", "dialogvisible"],
  components: { HalfCircleSpinner },

  data() {
    return {
      loading: true,
      imagePlaceholder:
        "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MCA3OS4xNjA0NTEsIDIwMTcvMDUvMDYtMDE6MDg6MjEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkExM0RGNDdBMzM1QzExRThCNjhCOTFBMEVCQUQzNDYxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkExM0RGNDc5MzM1QzExRThCNjhCOTFBMEVCQUQzNDYxIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkRBMUEyQ0NDMjc2QzExRTg5QUMyOTk2OTcxQkYxODMyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkRBMUEyQ0NEMjc2QzExRTg5QUMyOTk2OTcxQkYxODMyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4AIUFkb2JlAGTAAAAAAQMAEAMCAwYAAAWZAAAGSQAACC7/2wCEABALCwsMCxAMDBAXDw0PFxsUEBAUGx8XFxcXFx8eFxoaGhoXHh4jJSclIx4vLzMzLy9AQEBAQEBAQEBAQEBAQEABEQ8PERMRFRISFRQRFBEUGhQWFhQaJhoaHBoaJjAjHh4eHiMwKy4nJycuKzU1MDA1NUBAP0BAQEBAQEBAQEBAQP/CABEIAGQAZAMBIgACEQEDEQH/xACdAAEAAgMBAQAAAAAAAAAAAAAABQYBBAcCAwEBAAMBAAAAAAAAAAAAAAAAAAECAwQQAAEEAgMBAQEAAAAAAAAAAAECAwQFEQYAIDAQQBIRAAIBAgMCCwcFAAAAAAAAAAECAxEEACExYRIgMEFRcYGRodFSExBAsSIyQnKSsiMzBRIAAQQDAQEBAAAAAAAAAAAAAQAgMBEQITFxYYH/2gAMAwEAAhEDEQAAAOgAAHzPo09syAAAACF57IRXRjichFq9f9QE/wA24RIAAHLNGyVvpwGbRebPHSPNuFZAAERLfqVa2dct+x1eKmOuOedBy19CsgAY5b1LnOlIUb5ALzSL/nawDDYABjIgIK+L155I3IjS3SlwAAAAAAAAP//aAAgBAgABBQDxQkAEAgjB6JOU8Ucq+gEkIUnhSs8Ukp6NEZ+OEfz0DihwuK4Tny//2gAIAQMAAQUA8VqyQSOA5HRQweJGB9JxwqSeZSOJUD0czj4jOehQk8/hPn//2gAIAQEAAQUA/E9IYjobtqt1Xlsl+mojypcmY7gcodmlVjrbiHW/DZ5SpN590uSp+l8L0EXX3Q0kVfhutWtif8SlS1UNcayr8JjcN6PYaK8lbek3a10+t11Mrw2C+ap482dLsHod/cQkubhfLTJlSZblDtMqucbcQ632up67Gz66NYKehdVAKF9rUmqX0ZZdfd1fXnKlHYgEWOnVUwv6JZoKdKvFGJoSs11RX1iP3f/aAAgBAgIGPwCH6VRRDRgllBaKokDxbYb7mj+N7jcX/9oACAEDAgY/AIrCtpwGWVsLQv2Xkn//2gAIAQEBBj8A9y355FiTzOwUd+NyO8hdjookUn48WFiAe8mr6SnRQNXbBmupWmkP3Ma06BoOr2LFO7TWJNGQmpjHmQnm5sLJGwZHAZWGhBzB4m6LHKJvSQcwQU+NeAI3NTbyNGPxyZf3cTfA5fzue014E7chnNOpV4kf6CLWC5ADkaLIopn+QHtVEBZ2ICqMySdAMQ2rf20Ly087Zns04lob3cMEvylZCADXTXlwX/zZleM5iKXJhsDitevAVxFGvKxevcowk9xKst23ypI9FVSeSNSde/iRQCS6lr6MR0y+5tgwZryUyudK/SuxV0GAkF0+4Mgj0kUdG/WmN311Tasag99cerdSvM/mclqdHNhYLtmmsjka5vHtU82zswskbBkcBlYaEHMHhz3JNVLFYhzRrkvjwpbGQ1NswMdfI9cuog8IqdCKHDSxAzWJzWQZlNknjwVhhQySuaKiipJw9xctW6nUKyKaqig1ptPDIIqDkQcGSCtpKcyY/oJ2ocuymD6E0Mo5K7yH4MO/FCsSjnMnguAb66G7ypCM/wBT+GN2zhCMcmkPzO3Sxz9//9k=",
      userdata: {
        name: "",
        lastName: "",
        birthDate: "",
        phone: "",
        email: "",
        password: ""
      }
    };
  },
  onFileSelectec(event) {
    console.log(event);
  },
  methods: {
    onFileChange(e) {
      console.log("aqui esta");
      console.log(e);
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    clickInputFile() {
      console.log("esta aqui");
      document.getElementById("imagenContacto").click();
    },
    /*createImage(file) {
      var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = e => {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },*/
    sendContact() {
      let self = this;
      console.log('this.contact: ',this.userdata);

      this.$snotify.async(
        "Registrando nuevo contacto", "Registrando...",() => new Promise((resolve, reject) => {
            setTimeout(function() {
              sendContactMail(self.userdata)
                .then(function(response) {
                  console.log("data response: ", response);
                  setTimeout(
                    () =>
                      resolve({
                        title: "Registro correcto",
                        body: "El contacto se ha registrado correctamente",
                        config: {
                          closeOnClick: true,
                          titleMaxLength: 30,
                          timeout:2000
                        }
                      }),
                    1000
                  );
                  self.$emit('ActualizarListaContactos');
                })
                .catch(function(error) {
                    setTimeout(() => reject({
											title: 'Error',
											body: 'Error al subir datos. No se puede continuar con el registro',
											config: {
                        closeOnClick: true,
                          timeout:2000                        
											}
										}), 1000);
                })
                .finally(() => console.log("consulta api finalizada"));
            },1500);
          }));
    }, //TERMINA FUNCION
    clearForm() {
      document.getElementById("name").value = "";
      document.getElementById("lastName").value = "";
      document.getElementById("birthDate").value = "";
      document.getElementById("phone").value = "";
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";

    }
  }
};
</script>

<style lang="scss">
@import "../assets/scss/_variables";

.el-dialog.user-dialog {
  max-width: 400px;
  top: -10%;

  .el-dialog__header {
    padding: 0;

    .el-dialog__headerbtn {
      z-index: 1;
      background: rgba(0, 0, 0, 0.05);
      min-width: 18px;
      min-height: 18px;
      border-radius: 4px;

      .el-dialog__close {
        color: $background-color;
      }
    }
  }
  .el-dialog__body {
    padding: 0;
  }

  .avatar-box {
    background: $text-color-accent;
    margin-bottom: 50px;
    position: relative;

    div#photo {
      position: relative;
      font-size: 40px;
      width: 100px;
      height: 40px;
      padding: 10px;
      top: -40px;
      left: 130px;
      right: 0px;
      bottom: 0px;
    }
    input {
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      margin: auto;
      top: -60px;
      left: -50px;
      right: 0px;
      bottom: 0px;
    }
    img {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      position: relative;
      bottom: -50px;
      display: block;
      margin: 0 auto;
      background: white;
      border: 2px solid $text-color-accent;
      box-sizing: border-box;
    }

    .star {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 1;
      background: white;
      box-sizing: border-box;
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 28px;
      font-size: 20px;
      border-radius: 50%;
      border: 2px solid $text-color-accent;
      cursor: pointer;
      margin-top: 35px;
      margin-left: 35px;

      .mdi-star {
        color: #ffd730;
      }
      .mdi-star-outline {
        opacity: 0.5;
      }
    }
  }

  .form-box {
    padding: 30px;
    box-sizing: border-box;

    & > * {
      margin: 10px 0;
    }
    .el-button.is-round {
      display: block;
      margin: 0 auto;
      padding-left: 25%;
      padding-right: 25%;
    }
  }
}
</style>