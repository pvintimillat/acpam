function cedulaCorrecta(cedula) {

    if (cedula.length == 10) {

        let digito_region = cedula.substring(0, 2);

        if (digito_region >= 1 && digito_region <= 24) {

            let ultimo_digito = cedula.substring(9, 10);

            let pares = 0;
            for (let i = 1; i < 5; i++) {
                pares = pares + parseInt(cedula.substring(i * 2 - 1, i * 2));
            }

            let impares = 0;
            for (let i = 0; i < 5; i++) {
                if ((cedula.substring(i * 2, i * 2 + 1) * 2) > 9) {
                    impares = impares + cedula.substring(i * 2, i * 2 + 1) * 2 - 9;
                } else {
                    impares = impares + cedula.substring(i * 2, i * 2 + 1) * 2;
                }
            }

            let suma_total = (pares + impares);
            let primer_digito_suma = String(suma_total).substring(0, 1);
            let decena = (parseInt(primer_digito_suma) + 1) * 10;
            let digito_validador = decena - suma_total;

            if (digito_validador == 10) digito_validador = 0;

            if (digito_validador == ultimo_digito) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

exports.cedulaCorrecta = cedulaCorrecta;