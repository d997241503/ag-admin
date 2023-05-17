<template>
	<div>
	</div>
</template>
<script>
  import {
    getToken,
    setToken,
    removeToken
  } from 'utils/auth';
  import {
		loginfo
	} from '../../api/login.js';
  export default {
    name: 'ssologin',
    created() {
      // setToken('eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbnMiLCJ1c2VySWQiOiIxIiwibmFtZSI6Iui2hee6p-euoeeQhuWRmCIsImV4cCI6MTY3NjE5OTMxNX0.hPvDFq8MJVpPILfBWoCpGscA7dGRydsMoJ2cm3POEKSoTHImMZJmzJduHfU5mAz1H52h32E6K99AxYDHaSQxFvLNY6h7TblMhUh2yh7HtrYIuV2_Rk8m85fH3TmA854bH5AoxPvItFb-kDU5ZSX3p0St2jG2Oa-N8JjeFi8IEuE');
      // this.$router.push({ path: '/' });
      let toPath = this.getUrlKey('toPath', decodeURIComponent(window.location.href));
      if(!toPath) {
        let account = this.getUrlKey('account', window.location.href);
        let token = this.getUrlKey('token', window.location.href);
        if(account && token) {
          loginfo(account,token).then((res) => {
            if (res.status == 200) {
              // this.$message.success('登录成功')
              setToken(res.data);
              this.$store.commit('SET_MENUS', undefined)
              this.$router.push({ path: '/dashboard' });
            } else this.$message.error(res.msg)
          })
          .catch((err) => {
            this.$message.error('失败')
          })
        }
      } else {
        let id = this.getUrlKey('id', decodeURIComponent(window.location.href));
        let name = this.getUrlKey('name', decodeURIComponent(window.location.href));
        if(id) sessionStorage.setItem("todooperateid", id);
        if(name) sessionStorage.setItem("todooperatename", name);
        let account = this.getUrlKey('account', decodeURIComponent(window.location.href));
        let token = this.getUrlKey('token', decodeURIComponent(window.location.href));
        if(account && token) {
          loginfo(account,token).then((res) => {
            if (res.status == 200) {
              // this.$message.success('登录成功')
              setToken(res.data);
              // this.$router.push({
              //   path: '/backstage/index',
              //     query: {
              //       need: 'todo'
              //     }
              // })
              this.$store.commit('SET_MENUS', undefined)
              this.$router.push({ path: '/dashboard' });
            } else this.$message.error(res.msg)
          })
          .catch((err) => {
            this.$message.error('失败')
          })
        }
      }
      
    },

		methods: {
			getUrlKey(name, url) {
				return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1]
					.replace(
						/\+/g, '%20')) || null
			}
		}
  }
</script>