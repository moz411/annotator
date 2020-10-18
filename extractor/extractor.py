#!/usr/bin/env python

import io
import pprint as pp
import json
import string
import random
import tempfile
import cv2
from PIL import Image
from statistics import mode
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer, LTChar, LTImage, LTRect, LTFigure, LTTextBox
from pdf2image import convert_from_path, convert_from_bytes

pdf_file = '../dataset/MachineLearningForDummies/extract.pdf'
extract_vision_file = '../dataset/MachineLearningForDummies/output-1-to-12.json'
user_annotation_file = '../dataset/MachineLearningForDummies/annotator.json'
extracted_file = '../dataset/MachineLearningForDummies/extracted.json'
images_dir = '../dataset/MachineLearningForDummies/images/'

""" 
for num, page in enumerate(extract_pages(pdf_file)):
    elements = []
    for element in page:
        if isinstance(element, LTTextContainer):
            try:
                fonttype = mode([c.fontname for text_line in element 
                            for c in text_line  if isinstance(c, LTChar)]).split('-')[1]
            except IndexError:
                fonttype = 'Regular'
            permitted = string.ascii_letters + string.punctuation + string.whitespace
            txt = "".join(e for e in element.get_text() if e in permitted)
            try:
                first_word = txt.split()[0].upper()
            except IndexError:
                first_word = txt

            res = {
                'bbox': element.bbox,
                'x': element.bbox[0],
                'y': page.height - element.bbox[3],
                'dx': element.bbox[2] - element.bbox[0],
                'dy': element.bbox[3] - element.bbox[1],
                'first_word': first_word,
                'text': txt,
                'height': element.height,
                'fonttype': fonttype,
                'density': sum(1 for text_line in element for c in text_line  if isinstance(c, LTChar)),
                'color': 'black'
                }
            elements.append(res)
        # if isinstance(element, LTFigure):
        #     for ltimageobject in element:
        #         if isinstance(ltimageobject, LTImage):
        #             im = Image.frombytes(mode="1", 
        #                                 data = ltimageobject.stream.data, 
        #                                 size = ltimageobject.srcsize,
        #                                 decoder_name='raw') 
        #             im.save("new_fromIm_%s.jpg" % num)


    pdf.append(elements) """
    
# with open("pdf.json", "w") as file:
#    json.dump({'responses': pdf}, file)

extracted = []
with open(extract_vision_file, 'r') as file:
    extract_vision = json.load(file)

for page in extract_vision['responses']:
    elements = []
    width = page['fullTextAnnotation']['pages'][0]['width']
    height = page['fullTextAnnotation']['pages'][0]['height']
    blocks = page['fullTextAnnotation']['pages'][0]['blocks']
    for num, block in enumerate(blocks):          
        res = {}
        coords = block['boundingBox']['normalizedVertices']
        coords = [[e['x'] * width,
                  e['y'] * height] for e in coords]
        res['x'] = coords[0][0]
        res['y'] = coords[0][1]
        res['dx'] = coords[2][0] - res['x']
        res['dy'] = coords[2][1] - res['y']
        texte = []
        for word in block['paragraphs'][0]['words']:
            for symbol in word['symbols']:
                if ('text' in symbol.keys()):
                    texte.append(symbol['text'])
                if ('property' in symbol.keys()):
                    if ('detectedBreak' in symbol['property'].keys() 
                        and symbol['property']['detectedBreak']['type'] in ['SPACE', 'LINE_BREAK']):
                        texte.append(' ')
            #texte.append(' ')
        res['text'] = ''.join(texte)
        elements.append(res)
    extracted.append(elements)

annotated = []
with open(user_annotation_file, 'r') as file:
    user_annotation = json.load(file)

for pagenum, page in enumerate(user_annotation):
    blocs = [elem for elem in page if 'label' in elem]
    elements = []
    for blocnum, bloc in enumerate(blocs):
        res = [elem for elem in extracted[pagenum] if 
                            bloc['x'] <= elem['x'] and
                            bloc['y'] <= elem['y'] and
                            bloc['x'] + bloc['dx'] >= elem['x'] + elem['dx'] and
                            bloc['y'] + bloc['dy']  >= elem['y'] + elem['dy']]
        if res != []:
            res[0].update(bloc)
            res = res[0]
        else:
            res = bloc
        elements.append(res)
    annotated.append(elements)

with open(extracted_file, "w") as file:
    json.dump(annotated, file)

# pp.pprint(annotated)

# Extract all pages as images
""" images_from_path = convert_from_path(pdf_file, 
                                     dpi=200,
                                     grayscale = True,
                                     fmt='jpg',
                                     output_folder=images_dir) """
