import logging

# Configuração do logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('hello.log'),
        logging.StreamHandler()
    ]
)

# Criando o logger
logger = logging.getLogger(__name__)

# Fazendo o log de Hello World
logger.info('Hello World') 
