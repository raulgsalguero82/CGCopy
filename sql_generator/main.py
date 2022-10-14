from pathlib import Path

from utils.generators import (
    generar_ciudades,
    generar_culturas,
    generar_paises,
    generar_productos,
    generar_recetas,
    generar_restaurantes,
    relacionar_cultura_pais,
    relacionar_cultura_producto,
    relacionar_cultura_restaurante,
)

if __name__ == "__main__":
    dir = Path(__file__).parent.parent.absolute() / "sql"
    ids_culturas = generar_culturas(15000, dir / "01_culturas.sql")
    ids_paises = generar_paises(15000, dir / "02_paises.sql")
    ids_productos = generar_productos(15000, dir / "03_productos.sql")
    ids_ciudades = generar_ciudades(15000, dir / "04_ciudades.sql", ids_paises)
    ids_recetas = generar_recetas(15000, dir / "05_recetas.sql", ids_culturas)
    ids_restaurantes = generar_restaurantes(
        15000, dir / "06_restaurantes.sql", ids_ciudades
    )
    relacionar_cultura_producto(
        15000, dir / "07_cultura_producto.sql", ids_culturas, ids_productos
    )
    relacionar_cultura_pais(
        15000, dir / "08_cultura_pais.sql", ids_culturas, ids_paises
    )
    relacionar_cultura_restaurante(
        15000, dir / "09_cultura_restaurante.sql", ids_culturas, ids_restaurantes
    )
