#!/usr/bin/env python

import pprint as pp
import json
from statistics import mode
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer, LTChar

extract = '../dataset/MachineLearningForDummies/extract.pdf'
annotation = '../dataset/MachineLearningForDummies/annotation.json'
result = []

for page_layout in extract_pages(extract):
    for element in page_layout:
        if isinstance(element, LTTextContainer):
            try:
                fonttype = mode([c.fontname for text_line in element 
                            for c in text_line  if isinstance(c, LTChar)]).split('-')[1]
            except IndexError:
                fonttype = 'Regular'
            res = {
                'bbox': element.bbox,
                'first_word': element.get_text().split()[0][:20].upper(),
                'height': element.height,
                'fonttype': fonttype,
                'density': sum(1 for text_line in element for c in text_line  if isinstance(c, LTChar))
                }
            result.append(res)
    break
pp.pprint(result)
print()

with open(annotation, 'r') as file:
    selected = json.load(file)[0]
    selected = [elem for elem in selected if 'label' in elem]

pp.pprint(selected)