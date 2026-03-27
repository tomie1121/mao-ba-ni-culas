from flask import Flask, jsonify, request, render_template
import json
import os

app = Flask(__name__)

DATABASE_FILE = os.path.join(os.path.dirname(__file__),
                             'data', 'movies.json')


def read_database():
    try:
        with open(DATABASE_FILE, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []


def write_database(data):
    with open(DATABASE_FILE, 'w') as file:
        json.dump(data, file, indent=2)


def get_next_id(movies):
    return max([movie['id'] for movie in movies], default=0) + 1


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/movies', methods=['GET'])
def get_movies():
    return jsonify(read_database())


@app.route('/api/movies/<int:movie_id>', methods=['GET'])
def get_movie(movie_id):
    movies = read_database()
    movie = next((m for m in movies if m['id'] == movie_id), None)
    return jsonify(movie) if movie else jsonify({})


@app.route('/api/movies', methods=['POST'])
def create_movie():
    data = request.get_json()
    movies = read_database()

    new_movie = {
        'id': get_next_id(movies),
        'title': data.get('title', ''),
        'genre': data.get('genre', ''),
        'year': int(data.get('year', 0)),
        'rating': float(data.get('rating', 0)),
        'description': data.get('description', '')
    }

    movies.append(new_movie)
    write_database(movies)
    return jsonify(new_movie)


@app.route('/api/movies/<int:movie_id>', methods=['PUT'])
def update_movie(movie_id):
    data = request.get_json()
    movies = read_database()
    movie = next((m for m in movies if m['id'] == movie_id), None)

    if movie:
        movie.update({
            'title': data.get('title', movie['title']),
            'genre': data.get('genre', movie['genre']),
            'year': int(data.get('year', movie['year'])),
            'rating': float(data.get('rating', movie['rating'])),
            'description': data.get('description', movie['description'])
        })
        write_database(movies)
    return jsonify(movie if movie else {})


@app.route('/api/movies/<int:movie_id>', methods=['DELETE'])
def delete_movie(movie_id):
    movies = read_database()
    movie = next((m for m in movies if m['id'] == movie_id), None)

    if movie:
        movies.remove(movie)
        write_database(movies)
    return jsonify({})


if __name__ == '__main__':
    app.run(debug=True)