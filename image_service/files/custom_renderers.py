from rest_framework import renderers


class FileRenderer(renderers.BaseRenderer):
    media_type = None
    format = None
    render_style = 'binary'

    def render(self, data, media_type=None, renderer_context=None):
        return data