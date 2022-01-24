const { getRandomItem, getRandomValueInRange } = require("./../helpers/helpers");

class countGameController {
    getExample(req, res) {
        try {
            const { min, max, operations } = req.body;
            let example = this.generateExample(min, max, operations);
            let answers = this.generateAnswers(example.a, example.b, example.operation, min, max);

            return res.json({
                example,
                answers,
            });
        } catch (e) {
            return res.json({ message: "Generate error" });
        }
    }

    generateExample(min, max, operations) {
        let example = {};
        example.a = getRandomValueInRange(min, max);
        example.b = getRandomValueInRange(min, max);

        if (operations) {
            let operation = getRandomItem(operations);
            example.operation = operation;
        }

        return example;
    }

    resolveExample(a, b, operation) {
        if (operation === "PLUS") {
            return a + b;
        } else if (operation === "MINUS") {
            return a - b;
        } else if (operation === "DIVIDE") {
            return a / b;
        } else if (operation === "MULTIPLY") {
            return a * b;
        }
    }

    generateAnswers(a, b, operation, min, max) {
        let answers = [];
        let correctAnswer = this.resolveExample(a, b, operation);
        answers.push(correctAnswer);
        while (answers.length < 4) {
            let example = this.generateExample(min, max);
            let resolvedExample = this.resolveExample(example.a, example.b, operation);
            let answerIndex = answers.findIndex((a) => a === resolvedExample);
            if (answerIndex === -1) {
                answers.push(resolvedExample);
            }
        }

        return answers;
    }

    checkExample(req, res) {
        const { answer } = req.body;
        const { a, b, operation } = req.body.example;

        let resolvedExample = this.resolveExample(a, b, operation);

        global.io.emit("history", "work");
        res.json({
            isCorrect: resolvedExample === answer,
        });
    }
}

module.exports = new countGameController();
