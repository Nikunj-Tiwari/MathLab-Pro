from flask import Flask, render_template, request
import matplotlib.pyplot as plt
import numpy as np
import io
import base64

app = Flask(__name__)

def plot_triangle(side_length, triangle_inclination, side_inclination):
    height = np.sqrt(3) / 2 * side_length
    vertices = np.array([
        [0, 0],
        [side_length, 0],
        [side_length / 2, height]
    ])
    fig, ax = plt.subplots()
    triangle = plt.Polygon(vertices, closed=True, edgecolor='b', fill=None)
    ax.add_patch(triangle)
    ax.set_aspect('equal')
    ax.set_xlim(-1, side_length + 1)
    ax.set_ylim(-1, height + 1)
    ax.grid(True)
    ax.set_xlabel('X-axis')
    ax.set_ylabel('Y-axis')
    ax.set_title('Projection of an Equilateral Triangle')
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    image_data = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close()
    return image_data

def plot_hexagon(side_length, surface_inclination, diagonal_angle):
    angle = np.linspace(0, 2 * np.pi, 7)
    x = side_length * np.cos(angle)
    y = side_length * np.sin(angle)
    fig, ax = plt.subplots()
    hexagon = plt.Polygon(np.c_[x, y], closed=True, edgecolor='g', fill=None)
    ax.add_patch(hexagon)
    ax.set_aspect('equal')
    ax.set_xlim(-side_length - 10, side_length + 10)
    ax.set_ylim(-side_length - 10, side_length + 10)
    ax.grid(True)
    ax.set_xlabel('X-axis')
    ax.set_ylabel('Y-axis')
    ax.set_title('Projection of a Regular Hexagon')
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    image_data = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close()
    return image_data

def plot_pentagon(side_length, surface_inclination, side_inclination):
    angle = np.linspace(0, 2 * np.pi, 6)
    x = side_length * np.cos(angle)
    y = side_length * np.sin(angle)
    fig, ax = plt.subplots()
    pentagon = plt.Polygon(np.c_[x, y], closed=True, edgecolor='r', fill=None)
    ax.add_patch(pentagon)
    ax.set_aspect('equal')
    ax.set_xlim(-side_length - 10, side_length + 10)
    ax.set_ylim(-side_length - 10, side_length + 10)
    ax.grid(True)
    ax.set_xlabel('X-axis')
    ax.set_ylabel('Y-axis')
    ax.set_title('Projection of a Regular Pentagon')
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    image_data = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close()
    return image_data

def plot_rhombus(diagonal1, diagonal2, diagonal_angle):
    half_d1 = diagonal1 / 2
    half_d2 = diagonal2 / 2
    vertices = np.array([
        [-half_d1, 0],
        [0, -half_d2],
        [half_d1, 0],
        [0, half_d2]
    ])
    fig, ax = plt.subplots()
    rhombus = plt.Polygon(vertices, closed=True, edgecolor='purple', fill=None)
    ax.add_patch(rhombus)
    ax.set_aspect('equal')
    ax.set_xlim(-half_d1 - 10, half_d1 + 10)
    ax.set_ylim(-half_d2 - 10, half_d2 + 10)
    ax.grid(True)
    ax.set_xlabel('X-axis')
    ax.set_ylabel('Y-axis')
    ax.set_title('Projection of a Rhombus')
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    image_data = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close()
    return image_data

def plot_circle(diameter, inclination_h, inclination_v):
    fig, ax = plt.subplots()
    circle = plt.Circle((0, 0), diameter / 2, edgecolor='m', fill=None)
    ax.add_patch(circle)
    ax.set_aspect('equal')
    ax.set_xlim(-diameter, diameter)
    ax.set_ylim(-diameter, diameter)
    ax.grid(True)
    ax.set_xlabel('X-axis')
    ax.set_ylabel('Y-axis')
    ax.set_title('Projection of a Circle')
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    image_data = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close()
    return image_data

def plot_semi_circle(diameter, inclination_h, inclination_v):
    angle = np.linspace(0, np.pi, 100)
    x = diameter / 2 * np.cos(angle)
    y = diameter / 2 * np.sin(angle)
    fig, ax = plt.subplots()
    ax.plot(x, y, 'b')
    ax.plot([-diameter / 2, diameter / 2], [0, 0], 'b')
    ax.set_aspect('equal')
    ax.set_xlim(-diameter, diameter)
    ax.set_ylim(-diameter, diameter)
    ax.grid(True)
    ax.set_xlabel('X-axis')
    ax.set_ylabel('Y-axis')
    ax.set_title('Projection of a Semi-Circle')
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    image_data = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close()
    return image_data

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/solve', methods=['POST'])
def solve():
    shape = request.form['shape']
    if shape == 'triangle':
        side_length = float(request.form['side_length'])
        triangle_inclination = float(request.form['triangle_inclination'])
        side_inclination = float(request.form['side_inclination'])
        image_data = plot_triangle(side_length, triangle_inclination, side_inclination)
    elif shape == 'hexagon':
        side_length = float(request.form['side_length'])
        surface_inclination = float(request.form['surface_inclination'])
        diagonal_angle = float(request.form['diagonal_angle'])
        image_data = plot_hexagon(side_length, surface_inclination, diagonal_angle)
    elif shape == 'pentagon':
        side_length = float(request.form['side_length'])
        surface_inclination = float(request.form['surface_inclination'])
        side_inclination = float(request.form['side_inclination'])
        image_data = plot_pentagon(side_length, surface_inclination, side_inclination)
    elif shape == 'rhombus':
        diagonal1 = float(request.form['diagonal1'])
        diagonal2 = float(request.form['diagonal2'])
        diagonal_angle = float(request.form['diagonal_angle'])
        image_data = plot_rhombus(diagonal1, diagonal2, diagonal_angle)
    elif shape == 'circle':
        diameter = float(request.form['diameter'])
        inclination_h = float(request.form['inclination_h'])
        inclination_v = float(request.form['inclination_v'])
        image_data = plot_circle(diameter, inclination_h, inclination_v)
    elif shape == 'semi_circle':
        diameter = float(request.form['diameter'])
        inclination_h = float(request.form['inclination_h'])
        inclination_v = float(request.form['inclination_v'])
        image_data = plot_semi_circle(diameter, inclination_h, inclination_v)
    else:
        return "Shape not implemented"
    return render_template('result.html', image_data=image_data)

if __name__ == '__main__':
    app.run(debug=True)
