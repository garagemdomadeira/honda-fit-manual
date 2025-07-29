import os
import logging
import shutil
from pathlib import Path

# Configuração do logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('converter.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def setup_output_directory(input_dir: str, output_dir: str):
    """Cria a estrutura de diretórios de saída."""
    try:
        # Cria o diretório de saída se não existir
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        # Copia a estrutura de diretórios do input para o output
        for root, dirs, _ in os.walk(input_dir):
            for dir_name in dirs:
                src_path = os.path.join(root, dir_name)
                # Calcula o caminho relativo e cria no diretório de saída
                rel_path = os.path.relpath(src_path, input_dir)
                dst_path = os.path.join(output_dir, rel_path)
                Path(dst_path).mkdir(parents=True, exist_ok=True)
                logger.info(f"Criado diretório: {dst_path}")
    except Exception as e:
        logger.error(f"Erro ao criar estrutura de diretórios: {str(e)}")
        raise

def convert_file(input_file: str, output_file: str):
    """Converte um arquivo HTML de ISO-8859-1 para UTF-8."""
    try:
        # Lê o arquivo em ISO-8859-1
        with open(input_file, 'r', encoding='iso-8859-1') as f:
            content = f.read()
        
        # Substitui o charset no meta tag
        content = content.replace(
            'content="text/html; charset=iso-8859-1"',
            'content="text/html; charset=utf-8"'
        )
        
        # Salva o arquivo em UTF-8
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        logger.info(f"Convertido: {input_file} -> {output_file}")
    except Exception as e:
        logger.error(f"Erro ao converter arquivo {input_file}: {str(e)}")

def process_directory(input_dir: str, output_dir: str):
    """Processa todos os arquivos HTML recursivamente."""
    try:
        # Primeiro, configura a estrutura de diretórios
        setup_output_directory(input_dir, output_dir)
        
        # Processa todos os arquivos HTML
        for root, _, files in os.walk(input_dir):
            for file in files:
                if file.lower().endswith('.html'):
                    input_file = os.path.join(root, file)
                    # Calcula o caminho de saída preservando a estrutura
                    rel_path = os.path.relpath(root, input_dir)
                    output_file = os.path.join(output_dir, rel_path, file)
                    
                    convert_file(input_file, output_file)
    except Exception as e:
        logger.error(f"Erro ao processar diretório: {str(e)}")

if __name__ == "__main__":
    # Diretórios de entrada e saída
    INPUT_DIR = "manual/P00/HTML"
    OUTPUT_DIR = "manual/P00/HTML_UTF8"
    
    logger.info("Iniciando processo de conversão...")
    try:
        process_directory(INPUT_DIR, OUTPUT_DIR)
        logger.info("Processo de conversão concluído com sucesso!")
    except Exception as e:
        logger.error(f"Erro durante o processo de conversão: {str(e)}") 
