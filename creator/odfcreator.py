#!/usr/bin/env python

import sys
import json
from odf.opendocument import OpenDocumentText
from odf.style import (Style, TextProperties, ParagraphProperties,
                       ListLevelProperties, TabStop, TabStops)
from odf.text import (H, P, List, ListItem, ListStyle, ListLevelStyleNumber,
                      ListLevelStyleBullet)
from odf import teletype

source_file = sys.argv[1]
destination_file = source_file.replace('.json', '.odt')
with open(source_file, 'r') as file:
    extracted = json.load(file)

textdoc = OpenDocumentText()

# Creating different style used in the document
s = textdoc.styles

# For Level-1 Headings that are centerd
h1style = Style(name="CenterHeading 1", family="paragraph")
h1style.addElement(ParagraphProperties(attributes={"textalign": "center"}))
h1style.addElement(TextProperties(attributes={"fontsize": "18pt", "fontweight": "bold"}))

# For Level-2 Headings that are centered
h2style = Style(name="CenterHeading 2", family="paragraph")
h2style.addElement(ParagraphProperties(attributes={"textalign": "center"}))
h2style.addElement(TextProperties(attributes={"fontsize": "15pt", "fontweight": "bold"}))

# For bold text
boldstyle = Style(name="Bold", family="text")
boldstyle.addElement(TextProperties(attributes={"fontweight": "bold"}))

# For numbered list
numberedliststyle = ListStyle(name="NumberedList")
level = 1
numberedlistproperty = ListLevelStyleNumber(
    level=str(level), numsuffix=".", startvalue=1)
numberedlistproperty.setAttribute('numsuffix', ".")
numberedlistproperty.addElement(ListLevelProperties(
    minlabelwidth="%fcm" % (level - .2)))
numberedliststyle.addElement(numberedlistproperty)

# For Bulleted list
bulletedliststyle = ListStyle(name="BulletList")
level = 1
bulletlistproperty = ListLevelStyleBullet(level=str(level), bulletchar=u"•")
bulletlistproperty.addElement(ListLevelProperties(
    minlabelwidth="%fcm" % level))
bulletedliststyle.addElement(bulletlistproperty)


# Justified style
justifystyle = Style(name="justified", family="paragraph")
justifystyle.addElement(ParagraphProperties(
    attributes={"textalign": "justify"}))

# Creating a tabstop at 10cm
tabstops_style = TabStops()
tabstop_style = TabStop(position="10cm")
tabstops_style.addElement(tabstop_style)
tabstoppar = ParagraphProperties()
tabstoppar.addElement(tabstops_style)
tabparagraphstyle = Style(name="Question", family="paragraph")
tabparagraphstyle.addElement(tabstoppar)
s.addElement(tabparagraphstyle)


# Register created styles to styleset
s.addElement(h1style)
s.addElement(h2style)
s.addElement(boldstyle)
s.addElement(numberedliststyle)
s.addElement(bulletedliststyle)
s.addElement(justifystyle)
s.addElement(tabparagraphstyle)


for page, items in enumerate(extracted):
    for box in items:
        if(box['label'] == 'Titre 1'):
            # Adding main heading
            mymainheading_element = H(outlinelevel=1, stylename=h1style)
            mymainheading_text = box['text']
            teletype.addTextToElement(mymainheading_element, mymainheading_text)
            textdoc.text.addElement(mymainheading_element)

        if(box['label'] == 'Titre 2'):
            # Adding main heading
            mymainheading_element = H(outlinelevel=2, stylename=h2style)
            mymainheading_text = box['text']
            teletype.addTextToElement(mymainheading_element, mymainheading_text)
            textdoc.text.addElement(mymainheading_element)

        if(box['label'] == 'Auteur'):
            # Adding second heading
            mysecondheading_element = H(outlinelevel=2, stylename=h2style)
            mysecondheading_text =  box['text']
            teletype.addTextToElement(mysecondheading_element, mysecondheading_text)
            textdoc.text.addElement(mysecondheading_element)

        if(box['label'] == 'Paragraphe'):
            # Adding a paragraph
            paragraph_element = P(stylename=justifystyle)
            paragraph_text = box['text']
            teletype.addTextToElement(paragraph_element, paragraph_text)
            textdoc.text.addElement(paragraph_element, paragraph_text)

textdoc.save(destination_file)