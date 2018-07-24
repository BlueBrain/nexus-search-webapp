#!/usr/bin/env python
''' utility to display morphology in a browser '''
import webbrowser
import os.path
import sys
import base64
import sys
import numpy as np

import neurom as nm
from neurom.geom.transform import Translation
from neurom.core.dataformat import COLS

from tempfile import NamedTemporaryFile

from neurom.core.dataformat import COLS


def get_morph_data(file_name, recenter=True):
    ''' get the morphology data from neurom '''
    morph = nm.load_neuron(file_name)
    if recenter:
        transform = Translation(-morph.soma.center)
        morph = morph.transform(transform)

    data = morph._data.data_block  # pylint: disable=protected-access
    return morph, np.ascontiguousarray(data, dtype=np.float32)

input_file_path = sys.argv[1]
output_file_path = sys.argv[2]
morph, data = get_morph_data(input_file_path)
encoded_data = base64.b64encode(data).decode('ascii')
f = open(output_file_path,'w')
f.write(encoded_data)
f.close()

