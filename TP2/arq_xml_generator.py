import xml.etree.ElementTree as ET

tree = ET.parse('arq.xml')
root = tree.getroot()

for i, arqelem in enumerate(root.findall('ARQELEM')):
    # Árvore XML para cada arqelem
    arqelem_tree = ET.ElementTree(arqelem)
    
    # Escrever a árvore nos ficheiros XML
    filename = f"arq{i+1}.xml"
    arqelem_tree.write(filename, xml_declaration=True, encoding='utf-8')
