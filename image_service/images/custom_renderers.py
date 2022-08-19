from rest_framework import renderers


class ImageRenderer(renderers.BaseRenderer):
    media_type = 'image/jpg'
    format = 'jpg'
    render_style = 'binary'

    def render(self, data, media_type=None, renderer_context=None):
        return data