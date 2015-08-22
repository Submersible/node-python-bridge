from __future__ import unicode_literals

import six
import os
import sys
import json
import traceback

NODE_CHANNEL_FD = int(os.environ['NODE_CHANNEL_FD'])


def format_exception(t=None, e=None, tb=None):
    return dict(
        exception=dict(
            type=dict(
                name=t.__name__,
                module=t.__module__
            ) if t else None,
            message=str(e),
            args=getattr(e, 'args', None),
            format=traceback.format_exception_only(t, e)
        ) if e else None,
        traceback=dict(
            lineno=traceback.tb_lineno(tb) if hasattr(traceback, 'tb_lineno') else tb.tb_lineno,
            strack=traceback.format_stack(tb.tb_frame),
            format=traceback.format_tb(tb)
        ) if tb else None,
        format=traceback.format_exception(t, e, tb)
    )


if __name__ == '__main__':
    writer = os.fdopen(NODE_CHANNEL_FD, 'w')
    reader = os.fdopen(NODE_CHANNEL_FD, 'r')

    while True:
        try:
            # Read new command
            line = reader.readline()
            if not line:
                break
            data = json.loads(line)

            # Assert data saneness
            if data['type'] not in ['execute', 'evaluate']:
                raise Exception('Python bridge call `type` must be `execute` or `evaluate`')
            if not isinstance(data['code'], six.string_types):
                raise Exception('Python bridge call `code` must be a string.')

            # Run Python code
            if data['type'] == 'execute':
                exec(data['code'])
                response = dict(type='success')
            else:
                response = dict(type='success', value=eval(data['code']))
        except:
            t, e, tb = sys.exc_info()
            response = dict(type='exception', value=format_exception(t, e, tb))

        writer.write(json.dumps(response, separators=(',', ':')) + '\n')
        writer.flush()

    # Closing is messy
    try:
        reader.close()
    except IOError:
        pass

    try:
        writer.close()
    except IOError:
        pass
