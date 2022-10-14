from pathlib import Path
from random import choice
from uuid import uuid4

from faker import Faker
from tqdm import tqdm

faker = Faker()


def generar_uuids(n: int) -> list[str]:
    return [str(uuid4()) for _ in range(n)]


def generar_paises(n: int, file: Path) -> list[str]:
    ids = generar_uuids(n)
    with file.open("a") as f:
        f.write("\n\n-- Inserts de paises\n")
        for id in tqdm(ids):
            country = faker.country().replace("'", "")
            f.write(
                "INSERT INTO pais_entity "
                "(id, nombre) "
                f"values('{id}', '{country}');\n"
            )

    return ids


def generar_culturas(n: int, file: Path) -> list[str]:
    ids = generar_uuids(n)
    with file.open("a") as f:
        f.write("\n\n-- Inserts de culturas gastronómicas\n")
        for id in tqdm(ids):
            f.write(
                "INSERT INTO cultura_gastronomica_entity"
                "(id, nombre, descripcion) "
                f"values('{id}', '{faker.word()}', '{faker.sentence()}');\n"
            )

    return ids


def generar_productos(n: int, file: Path) -> list[str]:
    ids = generar_uuids(n)
    with file.open("a") as f:
        f.write("\n\n-- Inserts de productos\n")
        for id in tqdm(ids):
            f.write(
                "INSERT INTO producto_entity"
                "(id, nombre, historia, descripcion, categoria) "
                f"values('{id}', '{faker.word()}', '{faker.text()}', "
                f"'{faker.sentence()}', '{faker.word()}');\n"
            )

    return ids


def generar_recetas(n: int, file: Path, ids_culturas: list[str]) -> list[str]:
    ids = generar_uuids(n)
    with file.open("a") as f:
        f.write("\n\n-- Inserts de recetas\n")
        for id in tqdm(ids):
            f.write(
                "INSERT INTO receta_entity"
                '(id, nombre, descripcion, "urlFoto", "urlVideo"'
                ', "procesoDePreparacion", "culturaGastronomicaId") '
                f"values('{id}', '{faker.word()}', '{faker.sentence()}', '{faker.url()}'"
                f", '{faker.url()}', '{faker.text()}', '{choice(ids_culturas)}');\n"
            )

    return ids


def generar_ciudades(n: int, file: Path, ids_paises: list[str]) -> list[str]:
    ids = generar_uuids(n)
    with file.open("a") as f:
        f.write("\n\n-- Inserts de ciudades\n")
        for id in tqdm(ids):
            f.write(
                "INSERT INTO ciudad_entity"
                '(id, nombre, "paisId") '
                f"values('{id}', '{faker.city()}', '{choice(ids_paises)}');\n"
            )

    return ids


def generar_restaurantes(n: int, file: Path, ids_ciudades: list[str]) -> list[str]:
    ids = generar_uuids(n)
    with file.open("a") as f:
        f.write("\n\n-- Inserts de restaurantes\n")
        for id in tqdm(ids):
            f.write(
                "INSERT INTO restaurante_entity"
                '(id, nombre, "estrellasMichelin", "fechaDeConsecucion"'
                ', "ciudadId") '
                f"values('{id}', '{faker.word()}', "
                f"'{choice(['NINGUNA', 'UNA', 'DOS', 'TRES'])}', "
                f"'{faker.date()}', '{choice(ids_ciudades)}');\n"
            )

    return ids


def relacionar_cultura_producto(
    n: int, file: Path, ids_culturas: list[str], ids_productos: list[str]
) -> None:
    relaciones = set()
    while len(relaciones) < n:
        relaciones.add((choice(ids_culturas), choice(ids_productos)))
    with file.open("a") as f:
        f.write("\n\n-- Inserts de relación cultura-producto\n")
        for relacion in tqdm(relaciones):
            f.write(
                "INSERT INTO cultura_gastronomica_entity_productos_producto_entity"
                '("culturaGastronomicaEntityId", "productoEntityId") '
                f"values('{relacion[0]}', '{relacion[1]}');\n"
            )


def relacionar_cultura_pais(
    n: int, file: Path, ids_culturas: list[str], ids_paises: list[str]
) -> None:
    relaciones = set()
    while len(relaciones) < n:
        relaciones.add((choice(ids_culturas), choice(ids_paises)))
    with file.open("a") as f:
        f.write("\n\n-- Inserts de relación cultura-pais\n")
        for relacion in tqdm(relaciones):
            f.write(
                "INSERT INTO cultura_gastronomica_entity_paises_pais_entity"
                '("culturaGastronomicaEntityId", "paisEntityId") '
                f"values('{relacion[0]}', '{relacion[1]}');\n"
            )


def relacionar_cultura_restaurante(
    n: int, file: Path, ids_culturas: list[str], ids_restaurantes: list[str]
) -> None:
    relaciones = set()
    while len(relaciones) < n:
        relaciones.add((choice(ids_culturas), choice(ids_restaurantes)))
    with file.open("a") as f:
        f.write("\n\n-- Inserts de relación cultura-restaurante\n")
        for relacion in tqdm(relaciones):
            f.write(
                "INSERT INTO cultura_gastronomica_entity_restaurantes_restaurante_entity"
                '("culturaGastronomicaEntityId", "restauranteEntityId") '
                f"values('{relacion[0]}', '{relacion[1]}');\n"
            )
