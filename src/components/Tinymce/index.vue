<template>
	<div class='tinymce-container editor-container'>
		<textarea class='tinymce-textarea' :id="id"></textarea>
	</div>
</template>

<script>
    import {getToken} from 'utils/auth'
    import {uploadFile} from 'api/file'
    import mergeObj from 'lodash/merge'
	export default {
		name: 'tinymce',
		props: {
			id: {
				type: String,
				default: 'tinymceEditor'
			},
			value: {
				type: String,
				default: ''
			},
            options: {
                type: Object,
                default: () => ({})
            }
		},
        data() {
            const _this = this
            this.baseOpt = {
                selector: '#tinymceEditor',
                language: "zh-Hans",
                language_url: "/static/tinymce/langs/zh-Hans.js",
                height: 400,
                menubar: false,
                plugins: 'fullscreen, typography, image, lists, media, link',
                toolbar: ['removeformat undo redo |  bullist numlist | outdent indent | forecolor | fullscreen code',
						'bold italic blockquote | alignleft aligncenter alignright | styles | image media link '
					],
                branding: false,
                link_default_target: '_blank',
                images_upload_url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=meetingjoint`,
                images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
                    uploadFile({file: blobInfo.blob()}, 'eduction').then(res => {
                        if (res?.code === 0) {
                            resolve(res.fileUrl)
                        } else {
                            return Promise.reject(res.msg)
                        }
                    }).catch(msg => {
                        reject(msg)
                    })
                }),
                init_instance_callback: editor => {
					if (_this.value) {
						editor.setContent(_this.value)
					}
					_this.hasInit = true;
                    this.editor = editor
					editor.on('NodeChange Change KeyUp', () => {
						this.hasChange = true;
						this.$emit('input', editor.getContent({
							format: 'raw'
						}));
					});
				},
            }
            return {
                hasChange: false,
                hasInit: false
            }
        },
		watch: {
			value(val) {
				if (!this.hasChange && this.hasInit) {
					this.$nextTick(() => this.editor.setContent(val))
				}
			}
		},
		methods: {
			clearContent() {
				this.$nextTick(() => this.editor.setContent(""))
			}
		},
		mounted() {
            const options = mergeObj(this.baseOpt, this.options)
			tinymce.init(options)
		},
		destroyed() {
			this.editor.destroy();
		}
	}
</script>

<style scoped>
	.tinymce-container {
		position: relative
	}

	.tinymce-textarea {
		visibility: hidden;
		z-index: -1;
	}

	.editor-custom-btn-container {
		position: absolute;
		right: 15px;
		top: 18px;
	}

	.editor-upload-btn {
		display: inline-block;
	}
</style>
